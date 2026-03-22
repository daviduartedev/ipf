import { Link, useLocation } from 'react-router-dom';
import logoStore from '../assets/img/logo.png';
import logoHome from '../assets/img/inau-bg.png';
import logoDb from '../assets/img/nuke-bg.png';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();

  const getLinkClass = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  const getLogo = () => {
    switch (location.pathname) {
      case '/':
        return logoHome;
      case '/store':
        return logoStore;
      case '/db':
        return logoDb;
      default:
        return logoHome;
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <img src={getLogo()} alt="Inaudível Por Favor" className="navbar-logo" />
        
        <div className="nav-links">
          <Link className={getLinkClass('/')} to="/">INÍCIO</Link>
          <Link className={getLinkClass('/store')} to="/store">STORE</Link>
          <Link className={getLinkClass('/db')} to="/db">NUKE DB</Link>
        </div>
      </div>
    </nav>
  );
}
