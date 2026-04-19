import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { getSupabase } from '../lib/supabaseClient.js';
import { isSupabaseConfigured } from '../lib/isSupabaseConfigured.js';
import AdminLayout from './AdminLayout.jsx';
import AdminLogin from './AdminLogin.jsx';
import AdminPostList from './AdminPostList.jsx';
import AdminPostForm from './AdminPostForm.jsx';

export default function AdminShell() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(() => isSupabaseConfigured());

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabase();
    if (!supabase) {
      void Promise.resolve().then(() => setLoading(false));
      return;
    }
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = getSupabase();
    if (supabase) await supabase.auth.signOut();
    setSession(null);
  }

  if (loading) {
    return (
      <AdminLayout session={null} onSignOut={handleSignOut}>
        <p className="admin-muted" style={{ padding: 24 }}>
          A carregar…
        </p>
      </AdminLayout>
    );
  }

  if (!isSupabaseConfigured()) {
    return (
      <AdminLayout session={null} onSignOut={handleSignOut}>
        <p className="admin-error">
          Configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no ficheiro `.env` para usar o painel.
        </p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout session={session} onSignOut={handleSignOut}>
      <Routes>
        <Route
          index
          element={
            session ? <AdminPostList /> : <AdminLogin onSession={(s) => setSession(s)} />
          }
        />
        <Route
          path="new"
          element={session ? <AdminPostForm /> : <Navigate to="/adminipf" replace />}
        />
        <Route
          path="edit/:id"
          element={session ? <AdminPostForm /> : <Navigate to="/adminipf" replace />}
        />
      </Routes>
    </AdminLayout>
  );
}
