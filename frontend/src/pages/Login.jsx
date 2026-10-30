import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GlowCard } from '@/components/ui/spotlight-card';
import { Reveal } from '@/components/ui/reveal';

const INPUT_CLASS =
  'rounded-xl bg-ink/80 border border-white/15 px-4 py-3 text-mist placeholder:text-steel/70 focus:border-azure/60 focus:ring-4 focus:ring-azure/10 outline-none transition';

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
    <div className="relative overflow-hidden">
      {/* Resplandor dorado decorativo de fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-24 h-[480px] w-[480px] max-w-full -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(30,107,255,0.18),transparent_65%)] blur-2xl"
      />
      <div className="relative max-w-md mx-auto px-4 sm:px-6 py-20">
        <Reveal className="mb-8 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-sky mb-4">Acceso</p>
          <h1 className="font-display font-extrabold tracking-tight text-4xl sm:text-5xl text-mist mb-3">
            Ingresa a <span className="text-gradient-azure">VØKTER</span>
          </h1>
          <p className="text-steel text-lg">Vuelve a tus favoritos y sigue buscando.</p>
        </Reveal>

        <GlowCard customSize className="w-full p-6 sm:p-8">
          <div className="relative">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label htmlFor="login-email" className="sr-only">Correo electrónico</label>
              <input
                id="login-email"
                type="email"
                required
                placeholder="Correo electrónico"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={INPUT_CLASS}
              />
              <label htmlFor="login-password" className="sr-only">Contraseña</label>
              <input
                id="login-password"
                type="password"
                required
                placeholder="Contraseña"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={INPUT_CLASS}
              />

              {error && <p className="text-sm text-danger">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-azure text-mist font-semibold px-6 py-3 mt-2 shadow-[0_0_30px_-10px_rgba(30,107,255,0.8)] hover:bg-azureDeep transition-colors disabled:opacity-60"
              >
                {loading ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>

            <p className="text-sm text-steel mt-6 text-center">
              ¿No tienes cuenta?{' '}
              <Link to="/registro" className="text-sky hover:text-skySoft">Crear cuenta</Link>
            </p>
          </div>
        </GlowCard>

        <div className="mt-6 flex items-start gap-3 rounded-xl bg-surface/60 border border-white/10 p-4">
          <KeyRound aria-hidden="true" className="h-4 w-4 text-sky mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-mono text-steel mb-1">Cuenta demo</p>
            <p className="text-xs text-steel">demo@vokter.com — vokter123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
