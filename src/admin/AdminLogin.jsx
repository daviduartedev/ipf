import { useState } from 'react';
import { getSupabase } from '../lib/supabaseClient.js';

export default function AdminLogin({ onSession }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const supabase = getSupabase();
    if (!supabase) {
      setError('Supabase não está configurado (variáveis de ambiente).');
      return;
    }
    setLoading(true);
    const { data, error: signErr } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (signErr) {
      setError(signErr.message);
      return;
    }
    onSession(data.session);
  }

  return (
    <div className="admin-login">
      <p className="admin-muted">Inicie sessão com a conta do operador.</p>
      <form onSubmit={handleSubmit} className="admin-form">
        <label>
          E-mail
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Palavra-passe
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error ? <p className="admin-error">{error}</p> : null}
        <button type="submit" disabled={loading}>
          {loading ? 'A entrar…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
