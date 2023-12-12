import { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../reducers/user';
import styles from '../styles/SignUp.module.css';

function SignUp() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  // Redirige vers /loginComponent if logged in
  const router = useRouter();
  if (user.authToken) {
    router.push('/');
  }

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    fetch('http://localhost:3000/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, username, password }),
    }).then(response => response.json())
      .then(data => {
        if (data.result) {
            // Dispatch l'action login avec les informations de l'utilisateur
            dispatch(addUser({ authToken: data.authToken, username, firstName }));
  
            // Réinitialise le formulaire après le succès
            setUsername('');
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
  
            // Redirige l'utilisateur vers la page de connexion
            router.push('/login');
          } else {
            // Gère les erreurs d'inscription ici
            console.error('Erreur lors de l\'inscription :', data.error);
          }
        })
        .catch(error => {
          // Gère les erreurs réseau ici
          console.error('Erreur réseau lors de l\'inscription :', error);
        });
    };

  return (
    <div className={styles.container}>
     
      <h3 className={styles.title}>Create your Toychange account</h3>
      <input type="text" className={styles.input} onChange={(e) => setUsername(e.target.value)} value={username} placeholder="Username" />
      <input type="text" className={styles.input} onChange={(e) => setFirstName(e.target.value)} value={firstName} placeholder="Firstname" />
      <input type="text" className={styles.input} onChange={(e) => setLastName(e.target.value)} value={lastName} placeholder="lastname" />
      <input type="email" className={styles.input} onChange={(e) => setEmail(e.target.value)} value={email} placeholder="email" />
      <input type="password" className={styles.input} onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Password" />
      <button className={styles.button} onClick={() => handleSubmit()}>Sign up</button>
    </div>
  );
}

export default SignUp;