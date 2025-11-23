import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CheeseList from './pages/CheeseList';
import CheeseCreate from './pages/CheeseCreate';
import QuestionnaireList from './pages/QuestionnaireList';
import QuestionnaireCreate from './pages/QuestionnaireCreate';
import ResponsesList from './pages/ResponsesList';
import WebhooksList from './pages/WebhooksList';
import './styles/App.css';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/cheeses"
            element={
              <PrivateRoute>
                <CheeseList />
              </PrivateRoute>
            }
          />
          <Route
            path="/cheeses/new"
            element={
              <PrivateRoute>
                <CheeseCreate />
              </PrivateRoute>
            }
          />
          <Route
            path="/questionnaires"
            element={
              <PrivateRoute>
                <QuestionnaireList />
              </PrivateRoute>
            }
          />
          <Route
            path="/questionnaires/new"
            element={
              <PrivateRoute>
                <QuestionnaireCreate />
              </PrivateRoute>
            }
          />
          <Route
            path="/responses"
            element={
              <PrivateRoute>
                <ResponsesList />
              </PrivateRoute>
            }
          />
          <Route
            path="/webhooks"
            element={
              <PrivateRoute>
                <WebhooksList />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
