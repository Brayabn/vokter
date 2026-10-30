import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GlowCard } from '@/components/ui/spotlight-card';
import { Reveal } from '@/components/ui/reveal';

const INPUT_CLASS =
  'rounded-xl bg-ink/80 border border-white/15 px-4 py-3 text-mist placeholder:text-steel/70 focus:border-azure/60 focus:ring-4 focus:ring-azure/10 outline-none transition';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user', bio: '', skills: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'No pudimos crear tu cuenta.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative overflow-hidden">
      {/* Resplandor dorado decorativo de fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-24 h-[520px] w-[520px] max-w-full -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(30,107,255,0.18),transparent_65%)] blur-2xl"
      />
      <div className="relative max-w-md mx-auto px-4 sm:px-6 py-20">
        <Reveal className="mb-8 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-sky mb-4">Registro</p>
          <h1 className="font-display font-extrabold tracking-tight text-4xl sm:text-5xl text-mist mb-3">
            Crea tu <span className="text-gradient-azure">cuenta</span>
          </h1>
          <p className="text-steel text-lg">
            Entra como comprador, o como marca que quiere vender en VØKTER.
          </p>
        </Reveal>

        <GlowCard customSize className="w-full p-6 sm:p-8">
          <div className="relative">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex gap-3">
                {[
                  { value: 'user', label: 'Quiero comprar', Icon: ShoppingBag },
                  { value: 'expert', label: 'Quiero vender', Icon: Store },
                ].map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    aria-pressed={form.role === opt.value}
                    onClick={() => setForm({ ...form, role: opt.value })}
                    className={`flex-1 flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-sm transition-colors ${
                      form.role === opt.value
                        ? 'border-azure bg-azure/10 text-sky'
                        : 'border-white/15 text-steel hover:border-white/30'
                    }`}
                  >
                    <opt.Icon aria-hidden="true" className="h-4 w-4" />
                    {opt.label}
                  </button>
                ))}
              </div>

              <label htmlFor="reg-name" className="sr-only">Nombre completo</label>
              <input
                id="reg-name"
                required
                placeholder="Nombre completo"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={INPUT_CLASS}
              />
              <label htmlFor="reg-email" className="sr-only">Correo electrónico</label>
              <input
                id="reg-email"
                type="email"
                required
                placeholder="Correo electrónico"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={INPUT_CLASS}
              />
              <label htmlFor="reg-password" className="sr-only">Contraseña</label>
              <input
                id="reg-password"
                type="password"
                required
                placeholder="Contraseña"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={INPUT_CLASS}
              />

              {form.role === 'expert' && (
                <>
                  <label htmlFor="reg-bio" className="sr-only">Sobre tu marca</label>
                  <textarea
                    id="reg-bio"
                    placeholder="Cuéntanos brevemente qué vende tu marca"
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows={3}
                    className={`${INPUT_CLASS} resize-none`}
                  />
                  <label htmlFor="reg-skills" className="sr-only">Líneas de producto</label>
                  <input
                    id="reg-skills"
                    placeholder="Líneas de producto separadas por coma (ej: chaquetas, impermeable)"
                    value={form.skills}
                    onChange={(e) => setForm({ ...form, skills: e.target.value })}
                    className={INPUT_CLASS}
                  />
                </>
              )}

              {error && <p className="text-sm text-danger">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-azure text-mist font-semibold px-6 py-3 mt-2 shadow-[0_0_30px_-10px_rgba(30,107,255,0.8)] hover:bg-azureDeep transition-colors disabled:opacity-60"
              >
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </form>

            <p className="text-sm text-steel mt-6 text-center">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-sky hover:text-skySoft">Ingresa aquí</Link>
            </p>
          </div>
        </GlowCard>
      </div>
    </div>
  );
}
