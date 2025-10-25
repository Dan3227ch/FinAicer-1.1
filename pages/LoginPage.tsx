import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import { GoogleIcon } from '../components/Icons';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Error al iniciar sesión. Verifica tus credenciales.');
      console.error(err);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await googleLogin();
      navigate('/');
    } catch (err) {
      setError('Error al iniciar sesión con Google.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-slate-800 mb-6">Iniciar Sesión en FinAIcer</h1>
        <Card className="p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="mt-1 h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
              />
            </div>
            <div>
              <label className="text-sm font-medium">Contraseña</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="mt-1 h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 text-white h-10 px-4 font-medium hover:bg-blue-700 disabled:bg-slate-300"
            >
              {loading ? 'Cargando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-500">O continúa con</span></div>
          </div>
          
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md border bg-white h-10 px-4 font-medium hover:bg-slate-50 text-sm"
          >
            <GoogleIcon className="h-4 w-4" />
            Google
          </button>
        </Card>
        <p className="mt-4 text-center text-sm text-slate-500">
          ¿No tienes una cuenta? <Link to="/register" className="font-medium text-blue-600 hover:underline">Regístrate</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;