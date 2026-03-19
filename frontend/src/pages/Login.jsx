import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, AlertCircle } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import apiClient from '../api/client';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // OAuth2 Password Request Form requires x-www-form-urlencoded
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        
        const response = await apiClient.post('/auth/login', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        
        setAuth(response.data.access_token, { email });
        navigate('/dashboard');
      } else {
        await apiClient.post('/auth/signup', { email, password });
        // Auto login after signup
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        
        const loginResponse = await apiClient.post('/auth/login', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        setAuth(loginResponse.data.access_token, { email });
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-whatsapp-darker to-whatsapp-light p-4">
      <div className="glass w-full max-w-md p-8 rounded-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">WhatsApp Bulk SMS</h1>
          <p className="text-gray-600">{isLogin ? 'Welcome back!' : 'Create an account to get started'}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-light focus:border-transparent outline-none transition-all"
              placeholder="admin@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-light focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-whatsapp-dark hover:bg-whatsapp-darker text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : isLogin ? (
              <><LogIn size={20} /> Sign In</>
            ) : (
              <><UserPlus size={20} /> Sign Up</>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-whatsapp-dark font-semibold hover:underline"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
