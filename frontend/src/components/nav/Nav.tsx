
import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <nav className="nav">
      <Link to="/parc">Parc</Link>
      <Link to="/firewall">Firewall</Link>
      <Link to="/veeam">Veeam</Link>
      <Link to="/gravityzone">GravityZone</Link>
    </nav>
  );
};

export default Nav;
