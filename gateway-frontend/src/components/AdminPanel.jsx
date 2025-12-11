import { useState, useEffect } from 'react';
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3000/api' });

function AdminPanel() {
  const [rules, setRules] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]); // <--- NEW
  const [newRule, setNewRule] = useState({ pattern: '', action: 'AUTO_REJECT' });
  const [newUser, setNewUser] = useState({ username: '', role: 'member' });
  const [createdUserKey, setCreatedUserKey] = useState(null);

  const key = sessionStorage.getItem('apiKey');
  const headers = { headers: { 'x-api-key': key } };

  useEffect(() => {
    fetchRules();
    fetchSystemLogs(); // <--- NEW
  }, []);

  const fetchRules = async () => {
    try {
        const res = await API.get('/rules', headers);
        setRules(res.data);
    } catch(e) { console.error(e); }
  };

  // <--- NEW FUNCTION
  const fetchSystemLogs = async () => {
    try {
        const res = await API.get('/audit-logs', headers);
        setSystemLogs(res.data);
    } catch(e) { console.error(e); }
  };

  const handleAddRule = async (e) => {
    e.preventDefault();
    try {
      await API.post('/rules', newRule, headers);
      fetchRules();
      alert("Rule Added!");
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/users', newUser, headers);
      setCreatedUserKey(res.data.user); 
    } catch (err) {
      alert("Error: " + err.response?.data?.error);
    }
  };

  return (
    <div className="admin-section">
      <h2>Admin Controls</h2>
      
      {/* 1. Create User */}
      <div className="card">
        <h3>Create New User</h3>
        <form onSubmit={handleCreateUser}>
          <input placeholder="Username" onChange={e => setNewUser({...newUser, username: e.target.value})} required />
          <select onChange={e => setNewUser({...newUser, role: e.target.value})}>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Create User</button>
        </form>
        {createdUserKey && (
          <div className="key-reveal">
            <h4>User Created! Copy this now:</h4>
            <p style={{background: '#444', padding: '10px', fontFamily: 'monospace'}}>{createdUserKey.api_key}</p>
          </div>
        )}
      </div>

      {/* 2. Rules */}
      <div className="card">
        <h3>System Rules</h3>
        <form onSubmit={handleAddRule}>
          <input placeholder="Regex (e.g., ^git)" onChange={e => setNewRule({...newRule, pattern: e.target.value})} required />
          <select onChange={e => setNewRule({...newRule, action: e.target.value})}>
            <option value="AUTO_REJECT">AUTO_REJECT</option>
            <option value="AUTO_ACCEPT">AUTO_ACCEPT</option>
          </select>
          <button type="submit">Add Rule</button>
        </form>
        <ul>
            {rules.map(r => (
                <li key={r.id}><code>{r.pattern}</code> {'->'} <strong>{r.action}</strong></li>
            ))}
        </ul>
      </div>

      {/* 3. NEW: System Audit Logs */}
      <div className="card">
        <h3>🕵️‍♂️ Global System Logs</h3>
        <button onClick={fetchSystemLogs} style={{marginBottom: '10px', fontSize: '0.8rem'}}>Refresh Logs</button>
        <div className="log-list" style={{maxHeight: '300px', overflowY: 'auto'}}>
            {systemLogs.map(log => (
                <div key={log.id} className="log-item">
                    <span style={{color: '#888', fontSize: '0.8rem'}}>{log.timestamp.split(' ')[1]}</span>
                    <span style={{color: 'var(--accent-color)', fontWeight: 'bold'}}>{log.username}</span>
                    <strong>{log.command_text}</strong>
                    <span className={log.response_status}>{log.response_status}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;