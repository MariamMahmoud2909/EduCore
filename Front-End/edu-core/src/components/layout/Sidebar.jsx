import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiBook, FiUsers, FiUser, FiLogOut } from 'react-icons/fi';
import { authService } from '../../services/api';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/admin/courses', icon: FiBook, label: 'Courses' },
    { path: '/admin/instructors', icon: FiUsers, label: 'Instructors' },
    { path: '/admin/users', icon: FiUser, label: 'Users' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-logo">ByWay Admin</h2>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={authService.logout} className="sidebar-item logout-btn">
          <FiLogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;