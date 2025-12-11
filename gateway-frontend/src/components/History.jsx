import { useEffect, useState } from 'react';
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3000/api' });

function History() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const key = sessionStorage.getItem('apiKey');
    API.get('/my-history', { headers: { 'x-api-key': key } })
       .then(res => setLogs(res.data))
       .catch(err => console.error(err));
  }, []);

  return (
    <div className="card">
      <h3>My Activity Log</h3>
      <div className="log-list">
        {logs.map(log => (
            <div key={log.id} className="log-item">
                <span>{log.timestamp}</span>
                <strong>{log.command_text}</strong>
                <span className={log.response_status}>{log.response_status}</span>
            </div>
        ))}
      </div>
    </div>
  );
}

export default History;