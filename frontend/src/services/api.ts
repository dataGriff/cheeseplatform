import axios from 'axios';
import { 
  AuthResponse, 
  CheeseInput, 
  QuestionnaireInput, 
  ResponseSubmission, 
  WebhookInput 
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Service
export const authService = {
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', { name, email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('company', JSON.stringify(response.data.company));
    }
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('company', JSON.stringify(response.data.company));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('company');
  },

  getCurrentCompany: () => {
    const companyStr = localStorage.getItem('company');
    return companyStr ? JSON.parse(companyStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

// Cheese Service
export const cheeseService = {
  getAll: async () => {
    const response = await api.get('/cheeses');
    return response.data.cheeses;
  },

  getById: async (id: number) => {
    const response = await api.get(`/cheeses/${id}`);
    return response.data.cheese;
  },

  create: async (cheese: CheeseInput) => {
    const response = await api.post('/cheeses', cheese);
    return response.data;
  },

  update: async (id: number, cheese: Partial<CheeseInput>) => {
    const response = await api.put(`/cheeses/${id}`, cheese);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/cheeses/${id}`);
    return response.data;
  },
};

// Questionnaire Service
export const questionnaireService = {
  getAll: async () => {
    const response = await api.get('/questionnaires');
    return response.data.questionnaires;
  },

  getById: async (id: number) => {
    const response = await api.get(`/questionnaires/${id}`);
    return response.data.questionnaire;
  },

  create: async (questionnaire: QuestionnaireInput) => {
    const response = await api.post('/questionnaires', questionnaire);
    return response.data;
  },

  update: async (id: number, questionnaire: Partial<QuestionnaireInput>) => {
    const response = await api.put(`/questionnaires/${id}`, questionnaire);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/questionnaires/${id}`);
    return response.data;
  },
};

// Response Service
export const responseService = {
  submit: async (questionnaireId: number, data: ResponseSubmission) => {
    const response = await api.post(`/responses/${questionnaireId}/submit`, data);
    return response.data;
  },

  getForQuestionnaire: async (questionnaireId: number) => {
    const response = await api.get(`/responses/${questionnaireId}`);
    return response.data.responses;
  },
};

// Webhook Service
export const webhookService = {
  getAll: async () => {
    const response = await api.get('/webhooks');
    return response.data.webhooks;
  },

  create: async (webhook: WebhookInput) => {
    const response = await api.post('/webhooks', webhook);
    return response.data;
  },

  update: async (id: number, webhook: Partial<WebhookInput>) => {
    const response = await api.put(`/webhooks/${id}`, webhook);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/webhooks/${id}`);
    return response.data;
  },
};

export default api;
