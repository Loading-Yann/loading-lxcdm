import React, { useState, useEffect } from "react";
import axios from "axios";
import "./_firewallpage.scss";

interface Firewall {
  [key: string]: any;
}

interface FirewallData {
  clientName: string;
  dateCreated: string;
  firewalls: Firewall[];
}

const FirewallPage: React.FC = () => {
  const [firewalls, setFirewalls] = useState<FirewallData[]>([]);
  const [filteredFirewalls, setFilteredFirewalls] = useState<Firewall[]>([]);
  const [selectedClient, setSelectedClient] = useState("all");
  const [columns, setColumns] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLocalFirewalls();
  }, []);

  const fetchLocalFirewalls = async () => {
    try {
      const response = await axios.get("/firewalls/local");
      const data: FirewallData[] = response.data;

      setFirewalls(data);

      // Récupérer dynamiquement toutes les colonnes disponibles
      const allColumns = Array.from(
        new Set(
          data.flatMap((item: FirewallData) =>
            item.firewalls.flatMap((fw: Firewall) => Object.keys(fw))
          )
        )
      );

      // Ajouter les colonnes supplémentaires nécessaires
      if (!allColumns.includes("publicIP")) allColumns.push("publicIP");
      if (!allColumns.includes("lanIP")) allColumns.push("lanIP");
      if (!allColumns.includes("licenseType")) allColumns.push("licenseType");

      setColumns(allColumns);

      const initialVisibleColumns = allColumns.reduce((acc, col) => {
        acc[col] = true; // Toutes les colonnes visibles par défaut
        return acc;
      }, {} as { [key: string]: boolean });
      setVisibleColumns(initialVisibleColumns);

      // Enrichir les firewalls avec des déductions logiques
      const allFirewalls = data.flatMap((item: FirewallData) => item.firewalls);
      const enrichedFirewalls = allFirewalls.map((fw: Firewall) => ({
        ...fw,
        publicIP: fw.externalIpv4Addresses?.[0] || "Non spécifié",
        lanIP: fw.lanIP || "Non spécifié",
        licenseType: fw.capabilities?.includes("sdwanGroup") ? "Xstream" : "Standard",
      }));
      setFilteredFirewalls(enrichedFirewalls);
    } catch (error) {
      console.error("[ERROR] Erreur lors du chargement des données locales :", error);
    }
  };

  const handleClientFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const client = event.target.value;
    setSelectedClient(client);
    const clientFirewalls =
      client === "all"
        ? firewalls.flatMap((item) => item.firewalls)
        : firewalls
            .filter((item) => item.clientName === client)
            .flatMap((item) => item.firewalls);
    setFilteredFirewalls(clientFirewalls);
  };

  const toggleColumn = (column: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const toggleAllColumns = (toggle: boolean) => {
    const updatedColumns = columns.reduce((acc, col) => {
      acc[col] = toggle;
      return acc;
    }, {} as { [key: string]: boolean });
    setVisibleColumns(updatedColumns);
  };

  const renderValue = (value: any) => {
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return value;
  };

  return (
    <div className="firewall-page">
      <h1>Gestion des Firewalls</h1>

      <div className="controls">
        <select onChange={handleClientFilter} value={selectedClient}>
          <option value="all">Tous les clients</option>
          {firewalls.map((item, index) => (
            <option key={`${item.clientName}-${index}`} value={item.clientName}>
              {item.clientName}
            </option>
          ))}
        </select>

        <div className="toggle-all-controls">
          <button
            className="toggle-all-button"
            onClick={() => toggleAllColumns(true)}
          >
            Tout cocher
          </button>
          <button
            className="toggle-all-button"
            onClick={() => toggleAllColumns(false)}
          >
            Tout décocher
          </button>
        </div>

        <div className="column-toggles">
          {columns.map((col) => (
            <button
              key={col}
              className={`filter-button ${visibleColumns[col] ? "active" : ""}`}
              onClick={() => toggleColumn(col)}
            >
              {col}
            </button>
          ))}
        </div>
      </div>

      <div className="table-container">
        <table className="firewall-table">
          <thead>
            <tr>
              {columns.map(
                (col) => visibleColumns[col] && <th key={col}>{col}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredFirewalls.map((fw, index) => (
              <tr key={`${fw.id || fw.serialNumber || index}`}>
                {columns.map(
                  (col) =>
                    visibleColumns[col] && (
                      <td key={`${fw.id || fw.serialNumber || index}-${col}`}>
                        {renderValue(fw[col])}
                      </td>
                    )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FirewallPage;
