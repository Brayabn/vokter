import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display font-bold text-3xl text-mist mb-2">Crea tu cuenta</h1>
      <p className="text-lavender mb-8">Únete como alguien que busca conocimiento, o como experto que lo ofrece.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-3">
          {[
            { value: 'user', label: 'Busco conocimiento' },
            { value: 'expert', label: 'Ofrezco conocimiento' },
          ].map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => setForm({ ...form, role: opt.value })}
              className={`flex-1 rounded-xl border px-4 py-3 text-sm transition-colors ${
                form.role === opt.value
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-white/10 text-lavender hover:border-white/20'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <input
          required
          placeholder="Nombre completo"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded-xl bg-surface border border-white/10 px-4 py-3 text-mist placeholder:text-lavender/60 focus:border-gold/50 outline-none"
        />
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

        {form.role === 'expert' && (
          <>
            <textarea
              placeholder="Cuéntanos brevemente tu experiencia"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              className="rounded-xl bg-surface border border-white/10 px-4 py-3 text-mist placeholder:text-lavender/60 focus:border-gold/50 outline-none resize-none"
            />
            <input
              placeholder="Habilidades separadas por coma (ej: marketing, redes sociales)"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              className="rounded-xl bg-surface border border-white/10 px-4 py-3 text-mist placeholder:text-lavender/60 focus:border-gold/50 outline-none"
            />
          </>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-gold text-ink font-semibold px-6 py-3 mt-2 hover:bg-goldSoft transition-colors disabled:opacity-60"
        >
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>

      <p className="text-sm text-lavender mt-6">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-gold hover:text-goldSoft">Ingresa aquí</Link>
      </p>
    </div>
  );
}
