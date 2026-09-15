import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'No pudimos iniciar tu sesión.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display font-bold text-3xl text-mist mb-2">Ingresa a VØKTER</h1>
      <p className="text-lavender mb-8">Continúa descubriendo y conectando.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          required
          placeholder="Correo electrónico"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="rounded-xl bg-surface border border-white/10 px-4 py-3 text-mist placeholder:text-lavender/60 focus:border-gold/50 outline-none"
        />
        <input
          type="password"
          required
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="rounded-xl bg-surface border border-white/10 px-4 py-3 text-mist placeholder:text-lavender/60 focus:border-gold/50 outline-none"
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-gold text-ink font-semibold px-6 py-3 mt-2 hover:bg-goldSoft transition-colors disabled:opacity-60"
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <p className="text-sm text-lavender mt-6">
        ¿No tienes cuenta?{' '}
        <Link to="/registro" className="text-gold hover:text-goldSoft">Crear cuenta</Link>
      </p>

      <div className="mt-10 rounded-xl bg-surface border border-white/5 p-4">
        <p className="text-xs font-mono text-lavender mb-1">Cuenta demo</p>
        <p className="text-xs text-lavender">demo@vokter.com — vokter123</p>
      </div>
    </div>
  );
}
