import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth(); // Get auth state and logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // navigate('/login'); // AuthContext's logout already navigates
  };

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-gray-300 transition-colors">
          MovieApp
        </Link>
        <div className="space-x-4 flex items-center">
          <Link to="/" className="hover:text-gray-300 transition-colors">Home</Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="hover:text-gray-300 transition-colors">
                {user?.email ? `Profile (${user.email.split('@')[0]})` : 'Profile'}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300 transition-colors">Login</Link>
              <Link to="/register" className="hover:text-gray-300 transition-colors">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
