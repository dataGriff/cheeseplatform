import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

export default function ResponsesList() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🧀 Responses</h1>
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
          <h2>Questionnaire Responses</h2>
          
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '10px' }}>
            <h3>View responses by questionnaire</h3>
            <p>Go to the Questionnaires page and click "View Responses" on any questionnaire to see customer submissions.</p>
            <button 
              onClick={() => navigate('/questionnaires')}
              style={{ background: '#667eea', color: 'white', marginTop: '20px' }}
            >
              Go to Questionnaires
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}