import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError('Error al registrarse. Intenta con otro email.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-slate-800 mb-6">Crear Cuenta en FinAIcer</h1>
        <Card className="p-6">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nombre Completo</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="mt-1 h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
              />
            </div>
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
                minLength={6}
                required 
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 text-white h-10 px-4 font-medium hover:bg-blue-700 disabled:bg-slate-300"
            >
              {loading ? 'Creando cuenta...' : 'Registrarse'}
            </button>
          </form>
        </Card>
        <p className="mt-4 text-center text-sm text-slate-500">
          ¿Ya tienes una cuenta? <Link to="/login" className="font-medium text-blue-600 hover:underline">Inicia Sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;