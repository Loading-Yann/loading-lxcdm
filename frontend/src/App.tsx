import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/loginpage/LoginPage';
import ParcPage from './pages/parcpage/ParcPage';
import FirewallPage from './pages/firewallpage/FirewallPage';
import VeeamPage from './pages/veeampage/VeeamPage';
import GravityZonePage from './pages/gravityzonepage/GravityZonePage';
import NotFoundPage from './pages/notfoundpage/NotFoundPage';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import './styles/_app.scss';


const App = () => {
  return (
    <Router>
      <Header />
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
