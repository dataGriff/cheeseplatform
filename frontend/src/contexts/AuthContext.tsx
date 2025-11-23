import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/api';
import { Company } from '../types';

interface AuthContextType {
  company: Company | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [company, setCompany] = useState<Company | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const currentCompany = authService.getCurrentCompany();
    if (currentCompany) {
      setCompany(currentCompany);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    setCompany(response.company);
    setIsAuthenticated(true);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await authService.register(name, email, password);
    setCompany(response.company);
    setIsAuthenticated(true);
  };

  const logout = () => {
    authService.logout();
    setCompany(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ company, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
