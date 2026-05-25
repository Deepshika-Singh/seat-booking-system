import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition hover:opacity-80">
          <span className="text-2xl">🎭</span>
          <h1 className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-2xl font-bold text-transparent">
            SeatBooking
          </h1>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="font-medium transition hover:text-blue-400">
            Events
          </Link>

          {isAuthenticated && (
            <Link
              to="/my-bookings"
              className="font-medium transition hover:text-blue-400"
            >
              My Bookings
            </Link>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">
                {user?.name || user?.email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-red-600 px-4 py-2 font-medium transition hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="font-medium transition hover:text-blue-400">
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-blue-600 px-4 py-2 font-medium transition hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
