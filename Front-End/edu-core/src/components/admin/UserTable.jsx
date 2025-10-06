import React from 'react';
import { Button, Badge, Table } from 'react-bootstrap';
import { FiTrash2, FiShield, FiMail } from 'react-icons/fi';
import './AdminTables.css';

const UserTable = ({ users, onDelete, onToggleAdmin }) => {
  return (
    <div className="table-responsive">
      <Table hover className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Registered</th>
            <th>Orders</th>
            <th>Total Spent</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="fw-semibold">
                {user.firstName} {user.lastName}
              </td>
              <td>
                <a href={`mailto:${user.email}`} className="text-decoration-none">
                  <FiMail size={14} /> {user.email}
                </a>
              </td>
              <td>
                {user.isAdmin ? (
                  <Badge bg="danger">Admin</Badge>
                ) : (
                  <Badge bg="primary">User</Badge>
                )}
              </td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>
                <Badge bg="secondary">{user.ordersCount || 0}</Badge>
              </td>
              <td className="text-success fw-bold">
                ${user.totalSpent?.toFixed(2) || '0.00'}
              </td>
              <td>
                <div className="action-buttons">
                  <Button 
                    variant={user.isAdmin ? "outline-warning" : "outline-primary"}
                    size="sm"
                    onClick={() => onToggleAdmin(user.id, !user.isAdmin)}
                    title={user.isAdmin ? "Remove Admin" : "Make Admin"}
                  >
                    <FiShield />
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => onDelete(user.id)}
                    title="Delete User"
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserTable;