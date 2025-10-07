import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Nav, Tab } from 'react-bootstrap';
import { useAtom } from 'jotai';
import { motion } from 'framer-motion';
import { 
  FiClock, FiUsers, FiStar, FiBookOpen, FiAward, 
  FiShoppingCart, FiCheck, FiPlay 
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { courseService, cartService } from '../services/api';
import { userAtom, cartAtom, isAuthenticatedAtom } from '../store/atoms';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import CourseCard from '../components/courses/CourseCard';
import './CourseDetailPage.css';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user] = useAtom(userAtom);
  const [cart, setCart] = useAtom(cartAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  
  const [course, setCourse] = useState(null);
  const [similarCourses, setSimilarCourses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
    fetchSimilarCourses();
    fetchReviews();
  }, [id]);

  const fetchCourseDetails = async () => {
    setLoading(true);
    try {
      const response = await courseService.getCourse(id);
      setCourse(response.data);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to load course details');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarCourses = async () => {
    try {
      const response = await courseService.getSimilarCourses(id);
      setSimilarCourses(response.data || []);
    } catch (error) {
      console.error('Error fetching similar courses:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewService.getCourseReviews(id, { page: 1, pageSize: 10 });
      setReviews(response.data.items || response.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to add courses to cart');
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    try {
      await cartService.addToCart(id);
      
      // Update local cart state
      setCart([...cart, { ...course, courseId: id }]);
      
      toast.success('Course added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.response?.status === 400) {
        toast.warning('Course already in cart');
      } else {
        toast.error('Failed to add course to cart');
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const isInCart = () => {
    return cart.some(item => 
      item.id === parseInt(id) || item.courseId === parseInt(id)
    );
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!course) {
    return (
      <Container className="text-center py-5">
        <h2>Course not found</h2>
        <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
      </Container>
    );
  }

  return (
    <div className="course-detail-page">
      {/* Hero Section */}
      <div className="course-hero" style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${course.imageUrl || 'https://via.placeholder.com/1200x400'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <Container>
          <Row>
            <Col lg={8}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="course-category-badge">
                  {course.category?.name || course.categoryName || 'General'}
                </div>
                <h1 className="course-title">{course.title}</h1>
                <p className="course-description">{course.description}</p>
                
                <div className="course-meta">
                  <div className="meta-item">
                    <FiStar className="text-warning" />
                    <span>{course.rating?.toFixed(1) || '4.5'}</span>
                    <span className="text-muted">({course.reviewsCount || 0} reviews)</span>
                  </div>
                  <div className="meta-item">
                    <FiUsers />
                    <span>{course.enrolledStudents || course.studentsCount || 0} students</span>
                  </div>
                  <div className="meta-item">
                    <FiClock />
                    <span>{course.duration || '10'} hours</span>
                  </div>
                </div>

                <div className="course-instructor">
                  <img 
                    src={course.instructor?.imageUrl || 'https://via.placeholder.com/50'} 
                    alt={course.instructor?.name || course.instructorName}
                    className="instructor-avatar"
                  />
                  <div>
                    <p className="mb-0">Created by</p>
                    <h5>{course.instructor?.name || course.instructorName || 'Expert Instructor'}</h5>
                  </div>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="course-content">
        <Row>
          {/* Main Content */}
          <Col lg={8}>
            <Tab.Container defaultActiveKey="overview">
              <Nav variant="tabs" className="course-tabs">
                <Nav.Item>
                  <Nav.Link eventKey="overview">Overview</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="curriculum">Curriculum</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="instructor">Instructor</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="reviews">Reviews</Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content className="mt-4">
                {/* Overview Tab */}
                <Tab.Pane eventKey="overview">
                  <Card className="content-card">
                    <Card.Body>
                      <h3>What you'll learn</h3>
                      <Row className="g-3">
                        {(course.learningObjectives || [
                          'Master the fundamentals',
                          'Build real-world projects',
                          'Understand advanced concepts',
                          'Get job-ready skills'
                        ]).map((objective, index) => (
                          <Col md={6} key={index}>
                            <div className="learning-item">
                              <FiCheck className="text-success" />
                              <span>{objective}</span>
                            </div>
                          </Col>
                        ))}
                      </Row>

                      <hr className="my-4" />

                      <h3>Requirements</h3>
                      <ul className="requirements-list">
                        {(course.requirements || [
                          'No prior experience required',
                          'A computer with internet connection',
                          'Willingness to learn'
                        ]).map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>

                      <hr className="my-4" />

                      <h3>Description</h3>
                      <p className="course-full-description">
                        {course.fullDescription || course.description}
                      </p>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                {/* Curriculum Tab */}
                <Tab.Pane eventKey="curriculum">
                  <Card className="content-card">
                    <Card.Body>
                      <h3>Course Curriculum</h3>
                      <div className="curriculum-list">
                        {(course.modules || [
                          { title: 'Introduction', lessons: 5, duration: '1 hour' },
                          { title: 'Core Concepts', lessons: 8, duration: '3 hours' },
                          { title: 'Advanced Topics', lessons: 10, duration: '4 hours' },
                          { title: 'Final Project', lessons: 3, duration: '2 hours' }
                        ]).map((module, index) => (
                          <div key={index} className="curriculum-module">
                            <div className="module-header">
                              <h5>
                                <FiPlay /> {module.title}
                              </h5>
                              <span className="text-muted">
                                {module.lessons} lessons • {module.duration}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                {/* Instructor Tab */}
                <Tab.Pane eventKey="instructor">
                  <Card className="content-card">
                    <Card.Body>
                      <div className="instructor-profile">
                        <img
                          src={course.instructor?.imageUrl || 'https://via.placeholder.com/150'}
                          alt={course.instructor?.name || course.instructorName}
                          className="instructor-profile-image"
                        />
                        <div>
                          <h3>{course.instructor?.name || course.instructorName}</h3>
                          <p className="instructor-title">
                            {course.instructor?.title || 'Expert Instructor'}
                          </p>
                          <div className="instructor-stats">
                            <span><FiStar /> 4.8 Rating</span>
                            <span><FiUsers /> {course.instructor?.studentsCount || 10000} Students</span>
                            <span><FiBookOpen /> {course.instructor?.coursesCount || 15} Courses</span>
                          </div>
                        </div>
                      </div>
                      <p className="instructor-bio mt-3">
                        {course.instructor?.bio || 'Experienced instructor with years of industry experience.'}
                      </p>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                {/* Reviews Tab */}
                <Tab.Pane eventKey="reviews">
                  <Card className="content-card">
                    <Card.Body>
                      <h3>Student Reviews</h3>
                      {reviews.length === 0 ? (
                        <p className="text-muted">No reviews yet. Be the first to review!</p>
                      ) : (
                        <div className="reviews-list">
                          {reviews.map((review, index) => (
                            <div key={index} className="review-item">
                              <div className="review-header">
                                <div>
                                  <h6>{review.userName || 'Anonymous'}</h6>
                                  <div className="review-rating">
                                    {[...Array(5)].map((_, i) => (
                                      <FiStar
                                        key={i}
                                        className={i < review.rating ? 'text-warning' : 'text-muted'}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <span className="text-muted small">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p>{review.comment}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="course-sidebar-card sticky-top">
                <div className="course-preview">
                  <img
                    src={course.imageUrl || 'https://via.placeholder.com/400x300'}
                    alt={course.title}
                    className="preview-image"
                  />
                </div>
                <Card.Body>
                  <div className="price-section">
                    <h2 className="course-price">${course.price?.toFixed(2) || '99.99'}</h2>
                    {course.originalPrice && (
                      <span className="original-price">${course.originalPrice.toFixed(2)}</span>
                    )}
                  </div>

                  {isInCart() ? (
                    <Button 
                      variant="success" 
                      size="lg" 
                      className="w-100 mb-3"
                      onClick={() => navigate('/cart')}
                    >
                      <FiCheck /> In Cart - Go to Cart
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-100 mb-3"
                      onClick={handleAddToCart}
                      disabled={addingToCart}
                    >
                      {addingToCart ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <FiShoppingCart /> Add to Cart
                        </>
                      )}
                    </Button>
                  )}

                  <div className="course-includes">
                    <h5>This course includes:</h5>
                    <ul>
                      <li><FiClock /> {course.duration || '10'} hours on-demand video</li>
                      <li><FiBookOpen /> {course.articlesCount || 5} articles</li>
                      <li><FiAward /> Certificate of completion</li>
                      <li><FiUsers /> Lifetime access</li>
                    </ul>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Similar Courses */}
        {similarCourses.length > 0 && (
          <div className="similar-courses mt-5">
            <h2 className="section-title">Similar Courses</h2>
            <Row className="g-4">
              {similarCourses.slice(0, 3).map((similarCourse) => (
                <Col key={similarCourse.id} lg={4} md={6}>
                  <CourseCard course={similarCourse} />
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Container>
    </div>
  );
};

export default CourseDetailPage;