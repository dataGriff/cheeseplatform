import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionnaireService } from '../services/api';
import { Question } from '../types';
import '../styles/Dashboard.css';

export default function QuestionnaireCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `question_${questions.length + 1}`,
      type: 'text',
      label: '',
      required: false,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, updatedQuestion: Question) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = updatedQuestion;
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (questions.length === 0) {
      setError('At least one question is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await questionnaireService.create({
        title: title.trim(),
        description: description.trim(),
        questions,
        isActive: true,
      });
      navigate('/questionnaires');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create questionnaire');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🧀 Create New Questionnaire</h1>
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
          <h2>Create New Questionnaire</h2>
          
          {error && <div className="error">{error}</div>}
          
          <form onSubmit={handleSubmit} style={{ maxWidth: '800px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="title" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter questionnaire title"
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="description" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter questionnaire description"
                rows={3}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3>Questions</h3>
              {questions.map((question, index) => (
                <div key={question.id} style={{ 
                  border: '1px solid #ddd', 
                  padding: '20px', 
                  marginBottom: '15px', 
                  borderRadius: '5px',
                  backgroundColor: '#f9f9f9'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h4>Question {index + 1}</h4>
                    <button 
                      type="button" 
                      onClick={() => removeQuestion(index)}
                      style={{ background: '#dc3545', color: 'white', fontSize: '12px', padding: '5px 10px' }}
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                      Question Text *
                    </label>
                    <input
                      type="text"
                      value={question.label}
                      onChange={(e) => updateQuestion(index, { ...question, label: e.target.value })}
                      placeholder="Enter question text"
                      required
                    />
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                      Question Type
                    </label>
                    <select
                      value={question.type}
                      onChange={(e) => updateQuestion(index, { ...question, type: e.target.value as any })}
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="select">Single Choice</option>
                      <option value="multiselect">Multiple Choice</option>
                      <option value="range">Range (1-10)</option>
                    </select>
                  </div>

                  {(question.type === 'select' || question.type === 'multiselect') && (
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Options (comma separated)
                      </label>
                      <input
                        type="text"
                        value={question.options?.join(', ') || ''}
                        onChange={(e) => updateQuestion(index, { 
                          ...question, 
                          options: e.target.value.split(',').map(opt => opt.trim()).filter(opt => opt)
                        })}
                        placeholder="Option 1, Option 2, Option 3"
                      />
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      id={`required_${index}`}
                      checked={question.required || false}
                      onChange={(e) => updateQuestion(index, { ...question, required: e.target.checked })}
                    />
                    <label htmlFor={`required_${index}`} style={{ marginLeft: '8px' }}>
                      Required question
                    </label>
                  </div>
                </div>
              ))}
              
              <button 
                type="button" 
                onClick={addQuestion}
                style={{ background: '#28a745', color: 'white', marginBottom: '20px' }}
              >
                Add Question
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="submit" 
                disabled={loading}
                style={{ background: '#667eea', color: 'white' }}
              >
                {loading ? 'Creating...' : 'Create Questionnaire'}
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/questionnaires')}
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