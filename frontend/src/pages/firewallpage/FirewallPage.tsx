import React, { useState, useEffect } from "react";
import axios from "axios";
import "./_firewallpage.scss";

interface Firewall {
  clientName: string;
  publicIP: string;
  wanIP: string;
  lanIP: string;
  licenseDuration: string;
}

const FirewallPage = () => {
  const [firewalls, setFirewalls] = useState<Firewall[]>([]);
  const [filteredFirewalls, setFilteredFirewalls] = useState<Firewall[]>([]);
  const [selectedClient, setSelectedClient] = useState("all");
  const [visibleColumns, setVisibleColumns] = useState<{
    [key: string]: boolean;
  }>({
    clientName: true,
    publicIP: true,
    wanIP: true,
    lanIP: true,
    licenseDuration: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFirewalls();
  }, []);

  const fetchFirewalls = async () => {
    try {
      const response = await axios.get("/firewalls");
      setFirewalls(response.data);
      setFilteredFirewalls(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des données des firewalls:", error);
    }
  };

  const executeScript = async () => {
    setLoading(true);
    try {
      await axios.post("/firewalls/refresh");
      await fetchFirewalls();
      alert("Données mises à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'exécution du script:", error);
      alert("Erreur lors de l'exécution du script.");
    } finally {
      setLoading(false);
    }
  };

  const handleClientFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const client = event.target.value;
    setSelectedClient(client);
    if (client === "all") {
      setFilteredFirewalls(firewalls);
    } else {
      setFilteredFirewalls(
        firewalls.filter((fw: Firewall) => fw.clientName === client)
      );
    }
  };

  const toggleColumn = (column: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  return (
    <div className="firewall-page">
      <h1>Gestion des Firewalls</h1>

      <div className="controls">
        <button className="matrix-button" onClick={executeScript} disabled={loading}>
          {loading ? "Chargement..." : "Pillule Rouge"}
        </button>

        <select onChange={handleClientFilter} value={selectedClient}>
          <option value="all">Tous les clients</option>
          {Array.from(new Set(firewalls.map((fw: Firewall) => fw.clientName))).map(
            (clientName) => (
              <option key={clientName} value={clientName}>
                {clientName}
              </option>
            )
          )}
        </select>

        <div className="column-toggles">
          {Object.keys(visibleColumns).map((col) => (
            <label key={col}>
              <input
                type="checkbox"
                checked={visibleColumns[col]}
                onChange={() => toggleColumn(col)}
              />
              {col}
            </label>
          ))}
        </div>
      </div>

      <table className="firewall-table">
        <thead>
          <tr>
            {visibleColumns.clientName && <th>Client</th>}
            {visibleColumns.publicIP && <th>IP Publique</th>}
            {visibleColumns.wanIP && <th>IP WAN</th>}
            {visibleColumns.lanIP && <th>IP LAN</th>}
            {visibleColumns.licenseDuration && <th>Durée de la licence</th>}
          </tr>
        </thead>
        <tbody>
          {filteredFirewalls.map((fw: Firewall, index) => (
            <tr key={index}>
              {visibleColumns.clientName && <td>{fw.clientName}</td>}
              {visibleColumns.publicIP && <td>{fw.publicIP}</td>}
              {visibleColumns.wanIP && <td>{fw.wanIP}</td>}
              {visibleColumns.lanIP && <td>{fw.lanIP}</td>}
              {visibleColumns.licenseDuration && <td>{fw.licenseDuration}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FirewallPage;
