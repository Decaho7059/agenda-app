// src/Login.js
import React, { useState } from 'react';
import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onLogin(); // 👈 Callback vers App.js
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h2>{isSignup ? "Créer un compte" : "Connexion"}</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleAuth}>
        {isSignup ? "S'inscrire" : "Se connecter"}
      </button>
      <p style={{ color: 'red' }}>{error}</p>
      <p>
        {isSignup ? "Déjà un compte ?" : "Pas encore de compte ?"}{" "}
        <button onClick={() => setIsSignup(!isSignup)} style={{ color: '#3498db', background: 'none', border: 'none', cursor: 'pointer' }}>
          {isSignup ? "Se connecter" : "Créer un compte"}
        </button>
      </p>
    </div>
  );
}
