import React, { useState } from 'react';

const LoginComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost3000/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        // La requête a réussi, on peut traiter la réponse ici
        const data = await response.json();
        console.log(data);
      } else {
        // La requête a échoué, gère l'erreur ici
        console.error('Échec de la requête');
      }
    } catch (error) {
      console.error('Erreur lors de la requête', error);
    }
  };

  return (
    <div>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Se connecter</button>
    </div>
  );
};

export default LoginComponent;