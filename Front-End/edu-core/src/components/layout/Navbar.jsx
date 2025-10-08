import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiSettings } from 'react-icons/fi';
import { userAtom, isAuthenticatedAtom, isAdminAtom, cartCountAtom } from '../../store/atoms';
import { authService } from '../../services/api';
import './Navbar.css';

const Navbar = () => {
  const [user] = useAtom(userAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [isAdmin] = useAtom(isAdminAtom);
  const [cartCount] = useAtom(cartCountAtom);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <span className="logo-text">ByWay</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-links desktop-only">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/courses" className="nav-link">Courses</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </div>

          {/* Right Side Actions */}
          <div className="navbar-actions">
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="nav-icon-btn">
                  <FiShoppingCart size={22} />
                  {cartCount > 0 && (
                    <span className="cart-badge">{cartCount}</span>
                  )}
                </Link>

                {/* Profile Menu */}
                <div className="profile-menu-container">
                  <button 
                    className="profile-btn"
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  >
                    <FiUser size={22} />
                    <span className="desktop-only">{user?.firstName}</span>
                  </button>

                  {profileMenuOpen && (
                    <div className="profile-dropdown">
                      <div className="profile-info">
                        <p className="profile-name">{user?.firstName} {user?.lastName}</p>
                        <p className="profile-email">{user?.email}</p>
                      </div>
                      <div className="profile-divider"></div>
                      
                        <Link to="/my-courses" className="profile-menu-item" onClick={() => setProfileMenuOpen(false)}>
                          <FiBook size={18} />
                            <span>My Courses</span>
                        </Link>          
            
                      {isAdmin && (
                        <Link to="/admin/dashboard" className="profile-menu-item" onClick={() => setProfileMenuOpen(false)}>
                          <FiSettings size={18} />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                      <button onClick={handleLogout} className="profile-menu-item danger">
                        <FiLogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-ghost">Login</Link>
                <Link to="/register" className="btn btn-primary">Sign Up</Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-menu-btn mobile-only"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <Link to="/" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/courses" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>Courses</Link>
            <Link to="/about" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link to="/contact" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
