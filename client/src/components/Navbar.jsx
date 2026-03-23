import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiGrid, FiCalendar, FiSettings, FiLogOut, FiShield } from 'react-icons/fi';
import { HiOutlineSquares2X2 } from 'react-icons/hi2';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <HiOutlineSquares2X2 className="brand-icon" />
          SmartPark
        </Link>

        <div className="navbar-links">
          <div className="user-badge">
            <div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <span>{user?.name}</span>
          </div>

          <Link to="/" className={isActive('/')}>
            <FiGrid size={16} /> Dashboard
          </Link>

          <Link to="/bookings" className={isActive('/bookings')}>
            <FiCalendar size={16} /> My Bookings
          </Link>

          {user?.role === 'admin' && (
            <Link to="/admin/zones" className={isActive('/admin/zones')}>
              <FiShield size={16} /> Admin
            </Link>
          )}

          <button onClick={handleLogout}>
            <FiLogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
