import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FiBook, FiClock, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { enrollmentService } from '../services/api';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { Link } from 'react-router-dom';

const MyCoursesPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // all, in-progress, completed

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const response = await enrollmentService.getMyEnrollments();
      setEnrollments(response.data || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      toast.error('Failed to load your courses');
    } finally {
      setLoading(false);
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    if (activeTab === 'in-progress') return !enrollment.isCompleted;
    if (activeTab === 'completed') return enrollment.isCompleted;
    return true;
  });

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="my-courses-page py-5">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="page-title mb-4">My Courses</h1>

          {/* Tabs */}
          <div className="tabs-wrapper mb-4">
            <button
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Courses ({enrollments.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'in-progress' ? 'active' : ''}`}
              onClick={() => setActiveTab('in-progress')}
            >
              In Progress ({enrollments.filter(e => !e.isCompleted).length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              Completed ({enrollments.filter(e => e.isCompleted).length})
            </button>
          </div>

          {filteredEnrollments.length === 0 ? (
            <div className="text-center py-5">
              <FiBook size={64} className="text-muted mb-3" />
              <h3>No courses found</h3>
              <p className="text-muted">
                {activeTab === 'all' 
                  ? "You haven't enrolled in any courses yet." 
                  : `You don't have any ${activeTab === 'completed' ? 'completed' : 'in-progress'} courses.`}
              </p>
              <Link to="/courses" className="btn btn-primary mt-3">
                Browse Courses
              </Link>
            </div>
          ) : (
            <Row className="g-4">
              {filteredEnrollments.map((enrollment, index) => (
                <Col key={enrollment.id} lg={4} md={6}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="enrollment-card h-100">
                      <div className="position-relative">
                        <Card.Img
                          variant="top"
                          src={enrollment.courseImageUrl || 'https://via.placeholder.com/400x250'}
                          alt={enrollment.courseTitle}
                        />
                        {enrollment.isCompleted && (
                          <Badge bg="success" className="position-absolute top-0 end-0 m-2">
                            <FiCheckCircle /> Completed
                          </Badge>
                        )}
                      </div>
                      <Card.Body>
                        <Card.Title as={Link} to={`/courses/${enrollment.courseId}`}>
                          {enrollment.courseTitle}
                        </Card.Title>
                        <p className="text-muted small mb-3">
                          By {enrollment.instructorName}
                        </p>

                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span className="small">Progress</span>
                            <span className="small fw-bold">{enrollment.progressPercentage}%</span>
                          </div>
                          <ProgressBar 
                            now={enrollment.progressPercentage} 
                            variant={enrollment.isCompleted ? 'success' : 'primary'}
                          />
                        </div>

                        <div className="d-flex justify-content-between text-muted small">
                          <span>
                            <FiClock className="me-1" />
                            Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                          </span>
                        </div>

                        <Link
                          to={`/courses/${enrollment.courseId}`}
                          className="btn btn-primary w-100 mt-3"
                        >
                          {enrollment.isCompleted ? 'Review Course' : 'Continue Learning'}
                        </Link>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          )}
        </motion.div>
      </Container>
    </div>
  );
};

export default MyCoursesPage;