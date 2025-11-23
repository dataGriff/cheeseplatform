import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionnaireService } from '../services/api';
import { Questionnaire } from '../types';
import '../styles/Dashboard.css';

export default function QuestionnaireList() {
  const navigate = useNavigate();
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQuestionnaires();
  }, []);

  const loadQuestionnaires = async () => {
    try {
      const data = await questionnaireService.getAll();
      setQuestionnaires(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load questionnaires');
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: number, currentState: boolean) => {
    try {
      await questionnaireService.update(id, { isActive: !currentState });
      await loadQuestionnaires();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update questionnaire');
    }
  };

  const deleteQuestionnaire = async (id: number) => {
    if (!confirm('Are you sure you want to delete this questionnaire?')) return;
    
    try {
      await questionnaireService.delete(id);
      await loadQuestionnaires();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete questionnaire');
    }
  };

  if (loading) return <div className="loading">Loading questionnaires...</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🧀 Questionnaires</h1>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2>Questionnaires</h2>
            <button 
              onClick={() => navigate('/questionnaires/new')}
              style={{ background: '#667eea', color: 'white' }}
            >
              Create New Questionnaire
            </button>
          </div>
          
          {error && <div className="error">{error}</div>}
          
          {questionnaires.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '10px' }}>
              <h3>No questionnaires yet</h3>
              <p>Create your first questionnaire to start collecting customer preferences!</p>
              <button 
                onClick={() => navigate('/questionnaires/new')}
                style={{ background: '#667eea', color: 'white', marginTop: '20px' }}
              >
                Create First Questionnaire
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {questionnaires.map((questionnaire) => (
                <div 
                  key={questionnaire.id} 
                  style={{ 
                    backgroundColor: 'white', 
                    padding: '30px', 
                    borderRadius: '10px', 
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    border: questionnaire.is_active ? '2px solid #4caf50' : '2px solid #ddd'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ color: '#333', marginBottom: '10px' }}>
                        {questionnaire.title}
                        <span style={{ 
                          marginLeft: '10px',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          backgroundColor: questionnaire.is_active ? '#4caf50' : '#999',
                          color: 'white'
                        }}>
                          {questionnaire.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </h3>
                      {questionnaire.description && (
                        <p style={{ color: '#666', marginBottom: '15px' }}>{questionnaire.description}</p>
                      )}
                      <p style={{ color: '#999', fontSize: '14px' }}>
                        {questionnaire.questions.length} question{questionnaire.questions.length !== 1 ? 's' : ''}
                      </p>
                      {questionnaire.created_at && (
                        <p style={{ color: '#999', fontSize: '12px' }}>
                          Created: {new Date(questionnaire.created_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px', marginLeft: '20px' }}>
                      <button
                        onClick={() => toggleActive(questionnaire.id, questionnaire.is_active)}
                        style={{ 
                          background: questionnaire.is_active ? '#ffc107' : '#28a745', 
                          color: questionnaire.is_active ? '#000' : 'white',
                          fontSize: '12px' 
                        }}
                      >
                        {questionnaire.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => navigate(`/responses/${questionnaire.id}`)}
                        style={{ background: '#17a2b8', color: 'white', fontSize: '12px' }}
                      >
                        View Responses
                      </button>
                      <button
                        onClick={() => deleteQuestionnaire(questionnaire.id)}
                        style={{ background: '#dc3545', color: 'white', fontSize: '12px' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                    <h4 style={{ marginBottom: '10px', color: '#333' }}>Questions Preview:</h4>
                    <ul style={{ marginLeft: '20px' }}>
                      {questionnaire.questions.slice(0, 3).map((question) => (
                        <li key={question.id} style={{ marginBottom: '5px', color: '#666' }}>
                          {question.label} ({question.type})
                        </li>
                      ))}
                      {questionnaire.questions.length > 3 && (
                        <li style={{ color: '#999' }}>
                          ... and {questionnaire.questions.length - 3} more questions
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}