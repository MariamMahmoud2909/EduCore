import React from 'react';
import { Button, Badge, Table } from 'react-bootstrap';
import { FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import './AdminTables.css';
const BASE_URL = "https://mariam2909-001-site1.anytempurl.com";
const CourseTable = ({ courses, onEdit, onDelete, onView }) => {
  const getLevelBadge = (level) => {
    const badges = {
      1: { variant: 'success', text: 'Beginner' },
      2: { variant: 'warning', text: 'Intermediate' },
      3: { variant: 'danger', text: 'Expert' }
    };
    return badges[level] || badges[1];
  };

  return (
    <div className="table-responsive">
      <Table hover className="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Category</th>
            <th>Instructor</th>
            <th>Price</th>
            <th>Level</th>
            <th>Rating</th>
            <th>Duration</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => {
            const levelBadge = getLevelBadge(course.level);
            return (
              <tr key={course.id}>
                <td>
                  <img 
                    src={`${BASE_URL}${course.image}`}
                    //src={`${BASE_URL}/assets/images/courses/${course.image}`}
                    //src={course.image || 'https://via.placeholder.com/60x40'} 
                    alt={course.title}
                    className="table-image"
                  />
                </td>
                <td className="fw-semibold">{course.title}</td>
                <td>{course.categoryName}</td>
                <td>{course.instructorName}</td>
                <td className="text-primary fw-bold">${course.price}</td>
                <td>
                  <Badge bg={levelBadge.variant}>{levelBadge.text}</Badge>
                </td>
                <td>
                  <span className="rating">⭐ {course.rating}</span>
                </td>
                <td>{course.duration}h</td>
                <td>
                  {course.isPurchased ? (
                    <Badge bg="success">Published</Badge>
                  ) : (
                    <Badge bg="secondary">Draft</Badge>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => onView(course)}
                      title="View"
                    >
                      <FiEye />
                    </Button>
                    <Button 
                      variant="outline-success" 
                      size="sm"
                      onClick={() => onEdit(course)}
                      disabled={course.isPurchased}
                      title={course.isPurchased ? 'Cannot edit purchased course' : 'Edit'}
                    >
                      <FiEdit />
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => onDelete(course.id)}
                      disabled={course.isPurchased}
                      title={course.isPurchased ? 'Cannot delete purchased course' : 'Delete'}
                    >
                      <FiTrash2 />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default CourseTable;