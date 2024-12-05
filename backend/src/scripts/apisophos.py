import requests
import json
from pymongo import MongoClient
from datetime import datetime

# Connexion à MongoDB
def get_credentials_from_mongo():
    client = MongoClient("mongodb://<user>:<password>@<host>:<port>/<database>?authSource=admin")
    db = client["<database>"]  # Nom de votre base de données
    collection = db["credentials"]  # Nom de la collection
    return list(collection.find())

# Fonction pour lire ou initialiser le fichier firewalls.json
def read_or_initialize_firewalls():
    try:
        with open('firewalls.json', 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return []

# Fonction pour mettre à jour firewalls.json sans doublons
def update_firewalls(firewalls, client_name, date_created, firewall_data):
    existing_entry = next((entry for entry in firewalls if entry["clientName"] == client_name), None)

    if existing_entry:
        existing_entry["firewalls"] = firewall_data
        existing_entry["dateCreated"] = date_created
    else:
        firewalls.append({
            "clientName": client_name,
            "dateCreated": date_created,
            "firewalls": firewall_data
        })

    with open('firewalls.json', 'w') as file:
        json.dump(firewalls, file, indent=4)

# Fonction pour récupérer les données des pare-feu via l'API Sophos
def fetch_firewall_data(client_id, client_secret):
    base_url = "https://api.central.sophos.com"
    token_url = "https://id.sophos.com/api/v2/oauth2/token"
    whoami_url = base_url + "/whoami/v1"

    auth_data = {
        'grant_type': 'client_credentials',
        'client_id': client_id,
        'client_secret': client_secret,
        'scope': 'token'
    }

    try:
        # Obtenir un token d'accès
        response = requests.post(token_url, data=auth_data)
        response.raise_for_status()
        access_token = response.json().get("access_token")

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

        # Identifier l'instance du client
        response = requests.get(whoami_url, headers=headers)
        response.raise_for_status()
        tenant_id = response.json()["id"]
        data_region = response.json()["apiHosts"]["dataRegion"]

        firewall_url = f"{data_region}/firewall/v1/firewalls"
        headers["X-Tenant-ID"] = tenant_id

        # Récupérer les données des pare-feu
        response = requests.get(firewall_url, headers=headers)
        response.raise_for_status()
        firewalls = response.json().get("items", [])

        # Compléter les informations spécifiques pour chaque pare-feu
        for firewall in firewalls:
            firewall["isBackupMonthly"] = True  # Ajoutez ici la logique pour vérifier la périodicité du backup
            firewall["isPresentInSophosCentral"] = True  # Ajoutez la logique pour vérifier la présence dans Sophos Central
            firewall["publicIP"] = "192.168.0.1"  # Exemple : récupérer l'adresse IP publique
            firewall["wanIP"] = "192.168.1.1"  # Exemple : récupérer l'adresse IP WAN
            firewall["lanIP"] = "192.168.2.1"  # Exemple : récupérer l'adresse IP LAN
            firewall["licenseDuration"] = "12 months"  # Exemple : récupérer la durée des licences

        return firewalls

    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
    except Exception as err:
        print(f"Other error occurred: {err}")

    return None

# Fonction principale
def main():
    credentials = get_credentials_from_mongo()
    firewalls = read_or_initialize_firewalls()

    for cred in credentials:
        client_id = cred["clientId"]
        client_secret = cred["clientSecret"]
        client_name = cred["clientName"]
        date_created = cred.get("dateCreated", datetime.now().isoformat())

        firewall_data = fetch_firewall_data(client_id, client_secret)

        if firewall_data:
            for firewall in firewall_data:
                firewall["clientName"] = client_name  # Ajouter le clientName dans chaque pare-feu

            update_firewalls(firewalls, client_name, date_created, firewall_data)

    print("Les données des firewalls ont été mises à jour dans firewalls.json.")

if __name__ == "__main__":
    main()
