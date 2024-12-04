
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Header, Footer, Nav } from './components';
import {
  LoginPage,
  ParcPage,
  FirewallPage,
  VeeamPage,
  GravityZonePage,
  NotFoundPage,
} from './pages';
import './styles/index.scss';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Nav />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/parc" element={<ParcPage />} />
        <Route path="/firewall" element={<FirewallPage />} />
        <Route path="/veeam" element={<VeeamPage />} />
        <Route path="/gravityzone" element={<GravityZonePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
