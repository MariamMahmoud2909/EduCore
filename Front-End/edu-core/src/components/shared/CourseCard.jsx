import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiStar, FiUsers, FiClock } from 'react-icons/fi';
const BASE_URL = "https://mariam2909-001-site1.anytempurl.com";
const CourseCard = ({ course }) => {
  return (
    <Card className="course-card h-100">
      <div className="course-image">
        <Card.Img 
        variant="top" 
          src={`${BASE_URL}${course.image}`}
          alt={course.title}
      />
      </div>
      <Card.Body>
        <div className="course-category mb-2">
          {course.category?.name || course.categoryName || 'General'}
        </div>
        <Card.Title as={Link} to={`/courses/${course.id}`}>
          {course.title}
        </Card.Title>
        <Card.Text className="text-muted small">
          By {course.instructor?.name || course.instructorName || 'Unknown'}
        </Card.Text>
        <div className="course-meta d-flex align-items-center gap-3 mb-3">
          <span className="small">
            <FiStar className="text-warning" /> {course.rating?.toFixed(1) || '4.5'}
          </span>
          <span className="small">
            <FiUsers /> {course.studentsCount || 0}
          </span>
          <span className="small">
            <FiClock /> {course.duration || '10'}h
          </span>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">${course.price?.toFixed(2) || '99.99'}</h5>
          <Button 
            as={Link} 
            to={`/courses/${course.id}`} 
            variant="outline-primary"
            size="sm"
          >
            View Details
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CourseCard;