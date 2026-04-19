import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AdminLayout.css';

export default function AdminLayout({ session, onSignOut, children }) {
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"][data-admin="1"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      meta.setAttribute('content', 'noindex, nofollow');
      meta.setAttribute('data-admin', '1');
      document.head.appendChild(meta);
    }
    return () => {
      meta?.remove();
    };
  }, []);

  return (
    <div className="admin-root">
      <header className="admin-header">
        <div className="admin-header-inner">
          <Link to="/" className="admin-site-link">
            ← Site
          </Link>
          <h1 className="admin-title">Painel — Postagens</h1>
          {session ? (
            <button type="button" className="admin-logout" onClick={onSignOut}>
              Sair
            </button>
          ) : (
            <span />
          )}
        </div>
      </header>
      <div className="admin-body">{children}</div>
    </div>
  );
}
