import { useState } from 'react';
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3000/api' });

function Dashboard({ user, refreshUser }) {
  const [cmd, setCmd] = useState('');
  const [output, setOutput] = useState(null);

  const handleExecute = async (e) => {
    e.preventDefault();
    // Get key from storage manually since this instance is new
    const key = sessionStorage.getItem('apiKey'); 
    
    try {
      const res = await API.post('/commands', 
        { command_text: cmd }, 
        { headers: { 'x-api-key': key } }
      );
      
      setOutput(res.data);
      refreshUser(); // Update credit balance immediately
    } catch (err) {
      setOutput(err.response?.data || { error: "Server Error" });
    }
  };

  return (
    <div className="card">
      <h3>Command Terminal</h3>
      <form onSubmit={handleExecute}>
        <input 
          type="text" 
          value={cmd} 
          onChange={(e) => setCmd(e.target.value)} 
          placeholder="e.g., ls -la" 
        />
        <button type="submit">Run Command</button>
      </form>

      {output && (
        <div className={`result ${output.status === 'EXECUTED' ? 'success' : 'error'}`}>
          <p><strong>Status:</strong> {output.status || "Error"}</p>
          <p><strong>Message:</strong> {output.message || output.error}</p>
          {output.new_balance !== undefined && <p><strong>New Balance:</strong> {output.new_balance}</p>}
        </div>
      )}
    </div>
  );
}

export default Dashboard;