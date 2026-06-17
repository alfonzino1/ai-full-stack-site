import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Layout() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="layout">
      <header className="header">
        <nav className="nav">
          <Link to="/" className="nav-brand">
            📝 Blog CMS
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">
              Главная
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/posts/new" className="nav-link">
                  Написать статью
                </Link>
                <span className="nav-user">{user?.username}</span>
                <button className="nav-btn" onClick={handleLogout}>
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Войти
                </Link>
                <Link to="/register" className="nav-link">
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <p>© 2026 Blog CMS. Все права защищены.</p>
      </footer>
    </div>
  );
}
