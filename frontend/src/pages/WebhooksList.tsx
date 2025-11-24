import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

export default function WebhooksList() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🧀 Integrations</h1>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </header>

      <div className="dashboard-content">
        <nav className="dashboard-nav">
          <button onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button onClick={() => navigate('/cheeses')}>Cheeses</button>
          <button onClick={() => navigate('/questionnaires')}>Questionnaires</button>
          <button onClick={() => navigate('/responses')}>Responses</button>
          <button onClick={() => navigate('/webhooks')}>Integrations</button>
        </nav>

        <main className="dashboard-main">
          <h2>Webhook Integrations</h2>
          
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '10px' }}>
            <h3>Connect with external systems</h3>
            <p>Webhook integrations allow you to receive real-time notifications when customers complete questionnaires.</p>
            <p style={{ color: '#666', marginTop: '20px' }}>
              This feature will be available in a future update. You can monitor responses through the dashboard for now.
            </p>
            <button 
              onClick={() => navigate('/responses')}
              style={{ background: '#667eea', color: 'white', marginTop: '20px' }}
            >
              View Responses Instead
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}