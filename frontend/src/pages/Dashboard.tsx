import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cheeseService, questionnaireService } from '../services/api';
import { Cheese, Questionnaire } from '../types';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const { company, logout } = useAuth();
  const navigate = useNavigate();
  const [cheeses, setCheeses] = useState<Cheese[]>([]);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cheesesData, questionnairesData] = await Promise.all([
        cheeseService.getAll(),
        questionnaireService.getAll(),
      ]);
      setCheeses(cheesesData);
      setQuestionnaires(questionnairesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🧀 Cheese Platform Dashboard</h1>
        <div className="user-info">
          <span>{company?.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
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
          <h2>Welcome, {company?.name}!</h2>
          
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{cheeses.length}</h3>
              <p>Cheeses</p>
            </div>
            <div className="stat-card">
              <h3>{questionnaires.length}</h3>
              <p>Questionnaires</p>
            </div>
            <div className="stat-card">
              <h3>{questionnaires.filter(q => q.is_active).length}</h3>
              <p>Active Questionnaires</p>
            </div>
            <div className="stat-card">
              <h3>{company?.subscriptionTier}</h3>
              <p>Subscription Tier</p>
            </div>
          </div>

          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <button onClick={() => navigate('/cheeses/new')}>Add New Cheese</button>
            <button onClick={() => navigate('/questionnaires/new')}>Create Questionnaire</button>
            <button onClick={() => navigate('/webhooks')}>Setup Integrations</button>
          </div>

          <div className="recent-activity">
            <h3>Recent Questionnaires</h3>
            {questionnaires.length === 0 ? (
              <p>No questionnaires yet. Create your first one!</p>
            ) : (
              <ul>
                {questionnaires.slice(0, 5).map((q) => (
                  <li key={q.id}>
                    <strong>{q.title}</strong>
                    <span className={q.is_active ? 'active' : 'inactive'}>
                      {q.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
