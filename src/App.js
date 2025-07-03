import React, { useState, useEffect } from 'react';
import { db, auth } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './App.css';
import Login from './Login';

function App() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: '', date: '', time: '', description: '' });
  const [value, setValue] = useState(new Date());
  const [formVisible, setFormVisible] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) loadEvents();
    });
    return unsub;
  }, []);

  const loadEvents = async () => {
    if (!user) return;
    const q = query(collection(db, "events"), where("user", "==", user.uid));
    const snapshot = await getDocs(q);
    setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleAdd = async () => {
    if (!form.title || !form.date) return alert("Champ manquant !");
    if (!user) return alert("Utilisateur non connecté !");

    await addDoc(collection(db, "events"), { ...form, user: user.uid });

    setForm({ title: '', date: '', time: '', description: '' });
    loadEvents();
  };


  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "events", id));
    loadEvents();
  };

  const handleLogout = () => {
    signOut(auth);
    setUser(null);
    setEvents([]);
  };

  const eventsForSelectedDate = events
    .filter(ev => ev.date === value.toISOString().split('T')[0])
    .filter(ev => ev.user === user?.uid);

  const tileClassName = ({ date }) => {
    const formatted = date.toISOString().split('T')[0];
    return events.some(ev => ev.date === formatted && ev.user === user?.uid)
      ? 'has-event' : null;
  };

  if (!user) return <Login onLogin={() => loadEvents()} />;

  return (
    <div className="container">
      <h1>📅 Agenda de {user.email}</h1>
      <button onClick={handleLogout} style={{ float: 'right', marginBottom: '10px' }}>🚪 Déconnexion</button>

      <Calendar value={value} onChange={setValue} tileClassName={tileClassName} />

      <div className="day-events">
        <h2>Événements le {value.toISOString().split('T')[0]}</h2>
        {eventsForSelectedDate.length > 0 ? (
          <ul>
            {eventsForSelectedDate.map(ev => (
              <li className="event" key={ev.id}>
                <strong>🕒 {ev.time}</strong><br />
                <span className="title">{ev.title}</span><br />
                <em>{ev.description}</em>
                <button className="delete-btn" onClick={() => handleDelete(ev.id)}>🗑️</button>
              </li>
            ))}
          </ul>
        ) : <p>Aucun événement</p>}
      </div>

      {formVisible && (
        <div className="form">
          <input placeholder="Titre" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
          <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <button className="add-btn" onClick={handleAdd}>✅ Ajouter</button>
        </div>
      )}

      <button className="fab" onClick={() => setFormVisible(!formVisible)}>
        {formVisible ? '✖' : '+'}
      </button>

      <footer><p>© 2025 AgendaDecaho</p></footer>
    </div>
  );
}

export default App;
