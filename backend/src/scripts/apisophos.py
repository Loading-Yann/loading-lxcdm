import requests
import json
from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv
import os

# Charger les variables d'environnement
load_dotenv()

# Connexion à MongoDB
def get_mongo_client():
    mongo_uri = os.getenv("MONGO_URI")
    if not mongo_uri:
        print("[ERROR] MONGO_URI n'est pas défini dans le fichier .env")
        raise ValueError("MONGO_URI manquant")
    print(f"[INFO] Connexion à MongoDB avec URI : {mongo_uri}")
    return MongoClient(mongo_uri)

# Récupérer les credentials depuis MongoDB
def get_credentials_from_mongo():
    try:
        client = get_mongo_client()
        db_name = os.getenv("MONGO_DB_NAME", "test")
        collection_name = os.getenv("MONGO_CREDENTIALS_COLLECTION", "credentials")
        print(f"[INFO] Utilisation de la base de données '{db_name}' et de la collection '{collection_name}'.")
        db = client[db_name]
        collection = db[collection_name]
        credentials = list(collection.find())
        print(f"[INFO] Nombre de credentials récupérés : {len(credentials)}")
        return credentials
    except Exception as e:
        print(f"[ERROR] Erreur lors de la récupération des credentials : {str(e)}")
        raise

# Sauvegarder les données des firewalls dans MongoDB
def save_firewalls_to_mongo(firewalls):
    try:
        client = get_mongo_client()
        db_name = os.getenv("MONGO_DB_NAME", "test")
        collection_name = os.getenv("MONGO_FIREWALLS_COLLECTION", "firewalls")
        print(f"[INFO] Sauvegarde des données dans la base '{db_name}', collection '{collection_name}'.")
        db = client[db_name]
        collection = db[collection_name]

        for firewall_data in firewalls:
            client_name = firewall_data.get("clientName")
            print(f"[INFO] Traitement des données pour le client : {client_name}")
            existing_entry = collection.find_one({"clientName": client_name})

            if existing_entry:
                collection.update_one({"clientName": client_name}, {"$set": firewall_data})
                print(f"[INFO] Données mises à jour pour le client : {client_name}")
            else:
                collection.insert_one(firewall_data)
                print(f"[INFO] Données insérées pour le client : {client_name}")

        print("[INFO] Données des firewalls sauvegardées avec succès dans MongoDB.")
    except Exception as e:
        print(f"[ERROR] Erreur lors de la sauvegarde des firewalls dans MongoDB : {str(e)}")
        raise

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
        print(f"[INFO] Tentative d'obtention du token pour client_id : {client_id}")
        response = requests.post(token_url, data=auth_data)
        print(f"[DEBUG] Données envoyées pour l'authentification : {auth_data}")
        response.raise_for_status()
        access_token = response.json().get("access_token")
        print(f"[INFO] Token obtenu avec succès pour le client_id : {client_id}")

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
        print(f"[INFO] Tenant ID : {tenant_id}, Région : {data_region}")

        firewall_url = f"{data_region}/firewall/v1/firewalls"
        headers["X-Tenant-ID"] = tenant_id

        # Récupérer les données des pare-feu
        response = requests.get(firewall_url, headers=headers)
        response.raise_for_status()
        firewalls = response.json().get("items", [])
        print(f"[INFO] Nombre de firewalls récupérés : {len(firewalls)}")

        # Ajouter les données supplémentaires
        for firewall in firewalls:
            firewall["isBackupMonthly"] = True
            firewall["isPresentInSophosCentral"] = True
            firewall["publicIP"] = firewall.get("externalIpv4Addresses", [None])[0]
            firewall["wanIP"] = "192.168.1.1"  # À remplir dynamiquement si possible
            firewall["lanIP"] = "192.168.2.1"  # À remplir dynamiquement si possible
            firewall["licenseDuration"] = "12 months"

        return firewalls

    except requests.exceptions.HTTPError as http_err:
        print(f"[ERROR] HTTP error occurred: {http_err}")
    except Exception as err:
        print(f"[ERROR] Other error occurred: {err}")

    return None

# Fonction principale
def main():
    try:
        print("[INFO] Début du traitement.")
        credentials = get_credentials_from_mongo()
        firewalls = []

        for cred in credentials:
            client_id = cred.get("clientId")
            client_secret = cred.get("clientSecret")
            client_name = cred.get("clientName")

            if not client_id or not client_secret:
                print(f"[WARNING] clientId ou clientSecret manquant pour le client {client_name}")
                continue

            print(f"[INFO] Récupération des données pour le client : {client_name}")
            firewall_data = fetch_firewall_data(client_id, client_secret)

            if firewall_data:
                for firewall in firewall_data:
                    firewall["clientName"] = client_name

                firewalls.append({
                    "clientName": client_name,
                    "dateCreated": datetime.now().isoformat(),
                    "firewalls": firewall_data,
                })

        save_firewalls_to_mongo(firewalls)
        print("[INFO] Les données des firewalls ont été mises à jour avec succès.")

    except Exception as e:
        print(f"[ERROR] Erreur inattendue : {str(e)}")

if __name__ == "__main__":
    main()
