import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { responseService } from '../services/api';
import { Questionnaire, QuestionnaireResponse } from '../types';
import '../styles/App.css';

export default function PublicQuestionnaire() {
  const { id } = useParams<{ id: string }>();
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [responses, setResponses] = useState<QuestionnaireResponse[]>([]);
  const [customerEmail, setCustomerEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadQuestionnaire();
    }
  }, [id]);

  const loadQuestionnaire = async () => {
    try {
      // Use the public endpoint
      const response = await fetch(`/api/questionnaires/public/${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load questionnaire');
      }
      
      if (!data.questionnaire.is_active) {
        setError('This questionnaire is no longer available');
        return;
      }
      
      setQuestionnaire(data.questionnaire);
      
      // Initialize responses array
      const initialResponses: QuestionnaireResponse[] = data.questionnaire.questions.map((q: any) => ({
        questionId: q.id,
        answer: q.type === 'multiselect' ? [] : ''
      }));
      setResponses(initialResponses);
    } catch (err: any) {
      setError(err.message || 'Failed to load questionnaire');
    } finally {
      setLoading(false);
    }
  };

  const updateResponse = (questionId: string, answer: string | string[] | number) => {
    setResponses(prev => prev.map(r => 
      r.questionId === questionId ? { ...r, answer } : r
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionnaire) return;

    // Validate required fields
    const invalidResponses = responses.filter(r => {
      const question = questionnaire.questions.find(q => q.id === r.questionId);
      if (!question?.required) return false;
      
      if (Array.isArray(r.answer)) {
        return r.answer.length === 0;
      }
      return !r.answer || r.answer.toString().trim() === '';
    });

    if (invalidResponses.length > 0) {
      setError('Please answer all required questions');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const result = await responseService.submit(questionnaire.id, {
        customerEmail: customerEmail.trim() || undefined,
        responses
      });
      
      setRecommendations(result.recommendations || []);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit questionnaire');
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question: any) => {
    const response = responses.find(r => r.questionId === question.id);
    const value = response?.answer || '';

    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value as string}
            onChange={(e) => updateResponse(question.id, e.target.value)}
            placeholder="Enter your answer"
            required={question.required}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value as number}
            onChange={(e) => updateResponse(question.id, parseInt(e.target.value) || 0)}
            placeholder="Enter a number"
            required={question.required}
          />
        );

      case 'range':
        return (
          <div>
            <input
              type="range"
              min="1"
              max="10"
              value={value as number || 5}
              onChange={(e) => updateResponse(question.id, parseInt(e.target.value))}
              style={{ width: '100%', marginBottom: '10px' }}
            />
            <div style={{ textAlign: 'center', color: '#666' }}>
              Value: {value || 5}/10
            </div>
          </div>
        );

      case 'select':
        return (
          <select
            value={value as string}
            onChange={(e) => updateResponse(question.id, e.target.value)}
            required={question.required}
          >
            <option value="">Select an option</option>
            {question.options?.map((option: string) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <div style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '10px', minHeight: '100px' }}>
            {question.options?.map((option: string) => {
              const selectedOptions = Array.isArray(value) ? value : [];
              return (
                <label key={option} style={{ display: 'block', marginBottom: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option)}
                    onChange={(e) => {
                      const currentSelection = Array.isArray(value) ? value : [];
                      const newSelection = e.target.checked
                        ? [...currentSelection, option]
                        : currentSelection.filter(item => item !== option);
                      updateResponse(question.id, newSelection);
                    }}
                    style={{ marginRight: '8px' }}
                  />
                  {option}
                </label>
              );
            })}
          </div>
        );

      default:
        return <input type="text" placeholder="Question type not supported" disabled />;
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <div>Loading questionnaire...</div>
      </div>
    );
  }

  if (error && !questionnaire) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '10px', textAlign: 'center', maxWidth: '500px' }}>
          <h2>❌ Unable to Load Questionnaire</h2>
          <p style={{ color: '#666', marginTop: '20px' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '40px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', borderRadius: '10px', padding: '40px' }}>
          <h1 style={{ textAlign: 'center', color: '#4caf50', marginBottom: '30px' }}>
            ✅ Thank You for Your Submission!
          </h1>
          
          {recommendations.length > 0 && (
            <>
              <h2 style={{ color: '#333', marginBottom: '20px' }}>🧀 Your Cheese Recommendations</h2>
              <div style={{ display: 'grid', gap: '20px' }}>
                {recommendations.map((rec: any) => (
                  <div key={rec.id} style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ color: '#333', marginBottom: '10px' }}>{rec.name}</h3>
                        <p style={{ color: '#666', marginBottom: '15px' }}>{rec.description}</p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px', fontSize: '14px' }}>
                          <div><strong>Type:</strong> {rec.type}</div>
                          <div><strong>Texture:</strong> {rec.texture}</div>
                          <div><strong>Milk:</strong> {rec.milkType}</div>
                          <div><strong>Intensity:</strong> {rec.intensity}/10</div>
                        </div>
                        
                        <div style={{ marginBottom: '15px' }}>
                          <strong>Why this matches:</strong>
                          <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
                            {rec.matchReasons.map((reason: string, idx: number) => (
                              <li key={idx} style={{ color: '#666', fontSize: '14px' }}>{reason}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div style={{ marginLeft: '20px', textAlign: 'center' }}>
                        <div style={{ 
                          backgroundColor: '#4caf50', 
                          color: 'white', 
                          borderRadius: '50%', 
                          width: '60px', 
                          height: '60px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontSize: '18px',
                          fontWeight: 'bold'
                        }}>
                          {rec.matchScore}%
                        </div>
                        <div style={{ fontSize: '12px', marginTop: '5px', color: '#666' }}>Match</div>
                      </div>
                    </div>
                    
                    {rec.imageUrl && (
                      <img 
                        src={rec.imageUrl} 
                        alt={rec.name}
                        style={{ 
                          width: '100%', 
                          maxHeight: '200px', 
                          objectFit: 'cover', 
                          borderRadius: '5px', 
                          marginTop: '15px'
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
          
          <div style={{ textAlign: 'center', marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <p style={{ color: '#666' }}>
              We hope you find the perfect cheese! If you have any questions, please contact the cheese company directly.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', borderRadius: '10px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#333', fontSize: '32px', marginBottom: '10px' }}>🧀 {questionnaire?.title}</h1>
          {questionnaire?.description && (
            <p style={{ color: '#666', fontSize: '16px' }}>{questionnaire.description}</p>
          )}
        </div>

        {error && (
          <div style={{ backgroundColor: '#fee', color: '#c33', padding: '12px', borderRadius: '5px', marginBottom: '20px', border: '1px solid #fcc' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
              Email Address (optional)
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="Enter your email to receive updates"
              style={{ marginBottom: '0' }}
            />
            <small style={{ color: '#666', fontSize: '12px' }}>
              We'll use this to send you your results and updates about new cheeses
            </small>
          </div>

          {questionnaire?.questions.map((question, index) => (
            <div key={question.id} style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>
                {index + 1}. {question.label}
                {question.required && <span style={{ color: '#e74c3c' }}> *</span>}
              </label>
              {renderQuestion(question)}
            </div>
          ))}

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '15px 40px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1,
                transition: 'all 0.3s ease'
              }}
            >
              {submitting ? 'Finding Your Perfect Cheese...' : 'Get My Cheese Recommendations!'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}