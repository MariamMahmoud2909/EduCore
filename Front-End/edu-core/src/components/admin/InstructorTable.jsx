import React from 'react';
import { Button, Badge, Table } from 'react-bootstrap';
import { FiEdit, FiTrash2, FiMail } from 'react-icons/fi';
import './AdminTables.css';
const API_BASE_URL = 'https://mariam2909-001-site1.anytempurl.com/api';
const BASE_URL = "https://mariam2909-001-site1.anytempurl.com";
const InstructorTable = ({ instructors, onEdit, onDelete }) => {
  const getJobTitle = (jobTitle) => {
    const titles = {
      1: 'Fullstack Developer',
      2: 'Backend Developer',
      3: 'Frontend Developer',
      4: 'UX/UI Designer'
    };
    return titles[jobTitle] || 'Unknown';
  };

  const getJobTitleBadge = (jobTitle) => {
    const badges = {
      1: 'primary',
      2: 'success',
      3: 'info',
      4: 'warning'
    };
    return badges[jobTitle] || 'secondary';
  };

  return (
    <div className="table-responsive">
      <Table hover className="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Email</th>
            <th>Job Title</th>
            <th>Courses</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {instructors.map((instructor) => (
            <tr key={instructor.id}>
              <td>
                {/* <img 
                  //src={instructor.image || `https://ui-avatars.com/api/?name=${instructor.firstName}+${instructor.lastName}&size=40&background=1E3A8A&color=fff`} 
                  src={instructor.image.startsWith('/images/') 
    ? instructor.image 
    : `/images/instructors/${instructor.image}`} 
                  alt={`${instructor.firstName} ${instructor.lastName}`}
                  className="table-avatar" */}
                {/* /> */}
                  console.log("{instructor.image}");
                  <img
                    src={`${BASE_URL}/images/instructors/${instructor.image}`}
                    alt={`${instructor.firstName} ${instructor.lastName}`}

                    className="table-avatar"
                  />

              </td>
              <td className="fw-semibold">
                {instructor.firstName} {instructor.lastName}
              </td>
              <td>
                <a href={`mailto:${instructor.email}`} className="text-decoration-none">
                  <FiMail size={14} /> {instructor.email}
                </a>
              </td>
              <td>
                <Badge bg={getJobTitleBadge(instructor.jobTitle)}>
                  {getJobTitle(instructor.jobTitle)}
                </Badge>
              </td>
              <td>
                <Badge bg="secondary">{instructor.coursesCount || 0} courses</Badge>
              </td>
              <td>{new Date(instructor.createdAt).toLocaleDateString()}</td>
              <td>
                <div className="action-buttons">
                  <Button 
                    variant="outline-success" 
                    size="sm"
                    onClick={() => onEdit(instructor)}
                    title="Edit"
                  >
                    <FiEdit />
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => onDelete(instructor.id)}
                    title="Delete"
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

export default InstructorTable;