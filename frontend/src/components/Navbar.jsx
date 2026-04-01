import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 px-3 py-2 text-white shadow-soft">
            <span className="font-semibold">StrangerTour</span>
          </div>
          <nav className="hidden items-center gap-4 md:flex">
            {user && (
              <>
                <NavLink className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300" to="/">Dashboard</NavLink>
                <NavLink className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300" to="/trips">Trip Feed</NavLink>
                <NavLink className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300" to="/profile">Profile</NavLink>
              </>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
