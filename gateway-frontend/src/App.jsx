import { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import History from './components/History';
import AdminPanel from './components/AdminPanel';
import './App.css';

const API = axios.create({ baseURL: 'http://localhost:3000/api' });

function App() {
  const [apiKey, setApiKey] = useState(sessionStorage.getItem('apiKey') || '');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0); // Trigger to reload data

  useEffect(() => {
    if (apiKey) {
      API.get('/me', { headers: { 'x-api-key': apiKey } })
        .then(res => { setUser(res.data); setError(''); })
        .catch(() => { setUser(null); setError('Invalid API Key'); });
    }
  }, [apiKey, refresh]);

  const handleLogin = (e) => {
    e.preventDefault();
    const key = e.target.elements.key.value;
    sessionStorage.setItem('apiKey', key);
    setApiKey(key);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('apiKey');
    setApiKey('');
    setUser(null);
  };

  if (!apiKey || !user) {
    return (
      <div className="login-container">
        <h1>🔐 Command Gateway</h1>
        <form onSubmit={handleLogin}>
          <input name="key" placeholder="Enter API Key" required />
          <button type="submit">Login</button>
        </form>
        {error && <p className="error">{error}</p>}
        <div className="hint">
           <small>Try: admin-key-123</small>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <h2>Hi, {user.username}</h2>
        <div className="stats">
            <span>Credits: {user.credits}</span>
            <span>Role: {user.role}</span>
        </div>
        <button onClick={handleLogout}>Logout</button>
      </header>
      
      <main>
        <Dashboard user={user} refreshUser={() => setRefresh(n => n + 1)} />
        <History key={refresh} />
        {user.role === 'admin' && <AdminPanel />}
      </main>
    </div>
  );
}

export default App;