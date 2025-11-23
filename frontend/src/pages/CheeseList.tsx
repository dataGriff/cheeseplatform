import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cheeseService } from '../services/api';
import { Cheese } from '../types';
import '../styles/Dashboard.css';

export default function CheeseList() {
  const navigate = useNavigate();
  const [cheeses, setCheeses] = useState<Cheese[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCheeses();
  }, []);

  const loadCheeses = async () => {
    try {
      const data = await cheeseService.getAll();
      setCheeses(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load cheeses');
    } finally {
      setLoading(false);
    }
  };

  const deleteCheese = async (id: number) => {
    if (!confirm('Are you sure you want to delete this cheese?')) return;
    
    try {
      await cheeseService.delete(id);
      await loadCheeses();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete cheese');
    }
  };

  const formatFlavorProfile = (flavorProfile: any): string => {
    if (Array.isArray(flavorProfile)) {
      return flavorProfile.join(', ');
    }
    if (flavorProfile && flavorProfile.flavors) {
      return flavorProfile.flavors.join(', ');
    }
    return 'No flavors specified';
  };

  if (loading) return <div className="loading">Loading cheeses...</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🧀 Cheese Inventory</h1>
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
            <h2>Cheese Inventory</h2>
            <button 
              onClick={() => navigate('/cheeses/new')}
              style={{ background: '#667eea', color: 'white' }}
            >
              Add New Cheese
            </button>
          </div>
          
          {error && <div className="error">{error}</div>}
          
          {cheeses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '10px' }}>
              <h3>No cheeses yet</h3>
              <p>Add your first cheese to start building recommendations!</p>
              <button 
                onClick={() => navigate('/cheeses/new')}
                style={{ background: '#667eea', color: 'white', marginTop: '20px' }}
              >
                Add First Cheese
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
              {cheeses.map((cheese) => (
                <div 
                  key={cheese.id} 
                  style={{ 
                    backgroundColor: 'white', 
                    padding: '25px', 
                    borderRadius: '10px', 
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    border: '1px solid #ddd'
                  }}
                >
                  {cheese.image_url && (
                    <img 
                      src={cheese.image_url} 
                      alt={cheese.name}
                      style={{ 
                        width: '100%', 
                        height: '200px', 
                        objectFit: 'cover', 
                        borderRadius: '5px',
                        marginBottom: '15px'
                      }}
                    />
                  )}
                  
                  <h3 style={{ color: '#333', marginBottom: '10px' }}>{cheese.name}</h3>
                  
                  {cheese.description && (
                    <p style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}>
                      {cheese.description}
                    </p>
                  )}
                  
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
                      <div>
                        <strong>Type:</strong> {cheese.type || 'Not specified'}
                      </div>
                      <div>
                        <strong>Texture:</strong> {cheese.texture || 'Not specified'}
                      </div>
                      <div>
                        <strong>Milk:</strong> {cheese.milk_type || 'Not specified'}
                      </div>
                      <div>
                        <strong>Intensity:</strong> {cheese.intensity || 'Not specified'}/10
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <strong style={{ fontSize: '14px' }}>Flavors:</strong>
                    <p style={{ fontSize: '12px', color: '#666', margin: '5px 0 0 0' }}>
                      {formatFlavorProfile(cheese.flavor_profile)}
                    </p>
                  </div>
                  
                  {cheese.created_at && (
                    <p style={{ color: '#999', fontSize: '12px', marginBottom: '15px' }}>
                      Added: {new Date(cheese.created_at).toLocaleDateString()}
                    </p>
                  )}
                  
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => navigate(`/cheeses/edit/${cheese.id}`)}
                      style={{ background: '#ffc107', color: '#000', fontSize: '12px' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCheese(cheese.id)}
                      style={{ background: '#dc3545', color: 'white', fontSize: '12px' }}
                    >
                      Delete
                    </button>
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