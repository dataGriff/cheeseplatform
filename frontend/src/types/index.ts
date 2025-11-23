export interface Company {
  id: number;
  name: string;
  email: string;
  subscriptionTier: string;
  createdAt?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  company: Company;
}

export interface FlavorProfile {
  flavors?: string[];
  notes?: string[];
}

export interface Cheese {
  id: number;
  company_id: number;
  name: string;
  description: string;
  type: string;
  texture: string;
  flavor_profile: FlavorProfile | string[];
  milk_type: string;
  intensity: number;
  image_url: string;
  created_at?: string;
  updated_at?: string;
}

export interface CheeseInput {
  name: string;
  description?: string;
  type?: string;
  texture?: string;
  flavorProfile?: FlavorProfile | string[];
  milkType?: string;
  intensity?: number;
  imageUrl?: string;
}

export interface Question {
  id: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'range';
  label: string;
  options?: string[];
  required?: boolean;
}

export interface Questionnaire {
  id: number;
  company_id: number;
  title: string;
  description: string;
  is_active: boolean;
  questions: Question[];
  created_at?: string;
  updated_at?: string;
}

export interface QuestionnaireResponse {
  questionId: string;
  answer: string | string[] | number;
}

export interface Recommendation {
  id: number;
  name: string;
  description: string;
  type: string;
  texture: string;
  milkType: string;
  intensity: number;
  imageUrl: string;
  matchScore: number;
  matchReasons: string[];
}

export interface Webhook {
  id: number;
  company_id: number;
  url: string;
  event_type: string;
  is_active: boolean;
  created_at?: string;
}
