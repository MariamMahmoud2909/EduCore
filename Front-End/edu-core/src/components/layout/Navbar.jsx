import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiLayoutDashboard, FiBook } from 'react-icons/fi';
import { userAtom, isAuthenticatedAtom, isAdminAtom, cartCountAtom } from '../../store/atoms';
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <span className="logo-text">By</span>
            <span className="logo-text-accent">Way</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/courses" className="nav-link">Courses</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </div>

          {/* Right Side Actions */}
          <div className="navbar-actions">
            {isAuthenticated ? (
              <>
                {/* Cart Button */}
                <Link to="/cart" className="nav-icon-btn cart-btn" title="Shopping Cart">
                  <FiShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="cart-badge">{cartCount}</span>
                  )}
                </Link>

                {/* Profile Menu */}
                <div className="profile-menu-container">
                  <button 
                    className="profile-btn"
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    title="User Menu"
                  >
                    <div className="user-avatar">
                      {user?.firstName?.charAt(0).toUpperCase()}
                    </div>
                    <span className="user-name">{user?.firstName}</span>
                  </button>

                  {profileMenuOpen && (
                    <div className="profile-dropdown">
                      {/* Profile Header */}
                      <div className="profile-header">
                        <div className="profile-avatar-large">
                          {user?.firstName?.charAt(0).toUpperCase()}
                        </div>
                        <div className="profile-header-text">
                          <p className="profile-name">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="profile-email">{user?.email}</p>
                          {isAdmin && (
                            <span className="admin-badge">Admin</span>
                          )}
                        </div>
                      </div>

                      <div className="profile-divider"></div>

                      {/* Menu Items */}
                      <div className="profile-menu-items">
                        <Link 
                          to="/my-courses" 
                          className="profile-menu-item" 
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <FiBook size={20} />
                          <div>
                            <span className="item-label">My Courses</span>
                            <span className="item-hint">Your enrolled courses</span>
                          </div>
                        </Link>

                        {isAdmin && (
                          <Link 
                            to="/admin/dashboard" 
                            className="profile-menu-item admin-item"
                            onClick={() => setProfileMenuOpen(false)}
                          >
                            <FiLayoutDashboard size={20} />
                            <div>
                              <span className="item-label">Admin Dashboard</span>
                              <span className="item-hint">Manage platform</span>
                            </div>
                          </Link>
                        )}
                      </div>

                      <div className="profile-divider"></div>

                      {/* Logout Button */}
                      <button 
                        onClick={handleLogout} 
                        className="profile-logout-btn"
                      >
                        <FiLogOut size={20} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              title="Toggle Menu"
            >
              {mobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-links">
              <Link to="/" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/courses" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>
                Courses
              </Link>
              <Link to="/about" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
              <Link to="/contact" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
            </div>

            {isAuthenticated && (
              <div className="mobile-menu-footer">
                <Link 
                  to="/my-courses" 
                  className="mobile-menu-item"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiBook size={20} />
                  My Courses
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin/dashboard" 
                    className="mobile-menu-item"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FiLayoutDashboard size={20} />
                    Admin Dashboard
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="mobile-menu-item logout-item"
                >
                  <FiLogOut size={20} />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;