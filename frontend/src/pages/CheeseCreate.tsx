import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cheeseService } from '../services/api';
import '../styles/Dashboard.css';

export default function CheeseCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    texture: '',
    milkType: '',
    intensity: 5,
    imageUrl: '',
    flavors: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Cheese name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const flavorProfile = formData.flavors 
        ? formData.flavors.split(',').map(f => f.trim()).filter(f => f)
        : [];

      await cheeseService.create({
        name: formData.name.trim(),
        description: formData.description.trim(),
        type: formData.type,
        texture: formData.texture,
        milkType: formData.milkType,
        intensity: formData.intensity,
        imageUrl: formData.imageUrl.trim(),
        flavorProfile: flavorProfile,
      });
      
      navigate('/cheeses');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create cheese');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🧀 Add New Cheese</h1>
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
          <h2>Add New Cheese</h2>
          
          {error && <div className="error">{error}</div>}
          
          <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Cheese Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter cheese name"
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="description" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the cheese"
                rows={3}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label htmlFor="type" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="">Select type</option>
                  <option value="soft">Soft</option>
                  <option value="semi-soft">Semi-soft</option>
                  <option value="hard">Hard</option>
                  <option value="blue">Blue</option>
                  <option value="fresh">Fresh</option>
                </select>
              </div>

              <div>
                <label htmlFor="texture" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Texture
                </label>
                <select
                  id="texture"
                  name="texture"
                  value={formData.texture}
                  onChange={handleChange}
                >
                  <option value="">Select texture</option>
                  <option value="creamy">Creamy</option>
                  <option value="smooth">Smooth</option>
                  <option value="crumbly">Crumbly</option>
                  <option value="firm">Firm</option>
                  <option value="dense">Dense</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label htmlFor="milkType" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Milk Type
                </label>
                <select
                  id="milkType"
                  name="milkType"
                  value={formData.milkType}
                  onChange={handleChange}
                >
                  <option value="">Select milk type</option>
                  <option value="cow">Cow</option>
                  <option value="goat">Goat</option>
                  <option value="sheep">Sheep</option>
                  <option value="buffalo">Buffalo</option>
                </select>
              </div>

              <div>
                <label htmlFor="intensity" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Intensity (1-10)
                </label>
                <input
                  id="intensity"
                  name="intensity"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.intensity}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="flavors" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Flavor Profile (comma separated)
              </label>
              <input
                id="flavors"
                name="flavors"
                type="text"
                value={formData.flavors}
                onChange={handleChange}
                placeholder="mild, nutty, sharp, creamy"
              />
              <small style={{ color: '#666', fontSize: '12px' }}>
                Enter flavors separated by commas (e.g., mild, nutty, sharp, creamy)
              </small>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="imageUrl" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Image URL
              </label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/cheese-image.jpg"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="submit" 
                disabled={loading}
                style={{ background: '#667eea', color: 'white' }}
              >
                {loading ? 'Adding...' : 'Add Cheese'}
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/cheeses')}
                style={{ background: '#6c757d', color: 'white' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}