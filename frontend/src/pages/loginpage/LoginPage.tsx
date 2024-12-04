import React, { useState } from 'react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Username:', username, 'Password:', password);
    // Simuler une redirection vers une page après connexion
  };

  return (
    <div className="login-page">
      <h2>Connexion</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <label>Nom d'utilisateur</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Mot de passe</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button onClick={handleLogin}>Se connecter</button>
      </form>
      <p>
        <a href="/register">Demande d'inscription</a>
      </p>
    </div>
  );
};

export default LoginPage;
