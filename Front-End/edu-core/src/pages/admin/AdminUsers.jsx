import React, { useState, useEffect } from 'react';
import { Container, Form } from 'react-bootstrap';
import { FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Sidebar from '../../components/layout/Sidebar';
import UserTable from '../../components/admin/UserTable';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { userService } from '../../services/api';
import './AdminPages.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getUsers({ 
        page: currentPage, 
        pageSize: 10,
        search: searchTerm 
      });
      setUsers(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(userId);
        toast.success('User deleted successfully!');
        fetchUsers();
      } catch (error) {
        toast.error('Cannot delete admin users');
      }
    }
  };

  const handleToggleAdmin = async (userId, isAdmin) => {
    try {
      await userService.toggleAdminRole(userId, isAdmin);
      toast.success(isAdmin ? 'User promoted to Admin!' : 'Admin role removed!');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <Container fluid>
          <div className="admin-header">
            <div>
              <h1 className="admin-title">Users Management</h1>
              <p className="admin-subtitle">Manage all users on the platform</p>
            </div>
          </div>

          <div className="admin-toolbar">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <UserTable
                users={users}
                onDelete={handleDelete}
                onToggleAdmin={handleToggleAdmin}
              />

              {totalPages > 1 && (
                <div className="pagination-wrapper">
                  <Button
                    variant="outline-primary"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <span className="page-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline-primary"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </Container>
      </div>
    </div>
  );
};

export default AdminUsers;