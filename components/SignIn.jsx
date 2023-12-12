import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../redux/userSlice';

function SignInComponent() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      const response = await fetch('http://localhost:3000/users/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      // Dispatch l'action login avec les informations de l'utilisateur connecté
      dispatch(login(data.user));
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
    }
  };

  return (
    <div>
      {/* Formulaire de connexion */}
      <input type="text" placeholder="Votre Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignIn}>Se connecter</button>
    </div>
  );
}

export default SignIn;