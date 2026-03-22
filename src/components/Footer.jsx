export default function Footer() {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '20px',
      marginTop: '60px',
      fontFamily: "'Cinzel', serif"
    }}>
      <a 
        href="https://www.instagram.com/inaudivel_por_favor/" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ color: 'var(--primary)', textDecoration: 'none' }}
      >
        © 2026 Inaudível Por Favor — Todos os direitos reservados.
      </a>
    </footer>
  );
}
