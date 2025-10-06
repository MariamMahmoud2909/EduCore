import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { motion } from 'framer-motion';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { FiStar, FiClock, FiUsers, FiAward, FiShoppingCart, FiShare2 } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { courseService, cartService } from '../services/api';
import { cartAtom, userAtom } from '../store/atoms';
import CourseCard from '../components/shared/CategoryCard';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import './CourseDetailPage.css';

const CourseDetailPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [similarCourses, setSimilarCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useAtom(cartAtom);
  const [user] = useAtom(userAtom);
  const navigate = useNavigate();

  const isInCart = cart.some(item => item.id === course?.id);

  useEffect(() => {
    if (id) {
      fetchCourse();
      fetchSimilarCourses();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await courseService.getCourse(id);
      setCourse(response.data);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarCourses = async () => {
    try {
      const response = await courseService.getSimilarCourses(id);
      setSimilarCourses(response.data);
    } catch (error) {
      console.error('Error fetching similar courses:', error);
    }
  };

  const addToCart = async () => {
    if (!user) {
      toast.info('Please login to add courses to cart');
      navigate('/login');
      return;
    }

    try {
      await cartService.addToCart(course.id);
      setCart(prev => [...prev, course]);
      toast.success('Course added to cart!');
    } catch (error) {
      toast.error('Failed to add course to cart');
    }
  };

  const buyNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!isInCart) {
      addToCart();
    }
    navigate('/cart');
  };

  const shareOnSocial = (platform) => {
    const url = window.location.href;
    const text = `Check out this course: ${course.title}`;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${text} ${url}`
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const getLevelBadgeVariant = () => {
    switch(course?.level) {
      case 1: return 'success';
      case 2: return 'warning';
      case 3: return 'danger';
      default: return 'primary';
    }
  };

  const getLevelName = () => {
    switch(course?.level) {
      case 1: return 'Beginner';
      case 2: return 'Intermediate';
      case 3: return 'Expert';
      default: return 'Unknown';
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!course) return <div className="container py-5 text-center"><h2>Course not found</h2></div>;

  return (
    <div className="course-detail-page">
      {/* Course Header */}
      <section className="course-header">
        <Container>
          <Row>
            <Col lg={8}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge bg={getLevelBadgeVariant()} className="mb-3">
                  {getLevelName()}
                </Badge>
                <h1 className="course-detail-title">{course.title}</h1>
                <p className="course-detail-description">{course.description}</p>
                
                <div className="course-detail-meta">
                  <div className="meta-item">
                    <FiStar className="text-warning" />
                    <span>{course.rating.toFixed(1)} Rating</span>
                  </div>
                  <div className="meta-item">
                    <FiUsers />
                    <span>1,234 Students</span>
                  </div>
                  <div className="meta-item">
                    <FiClock />
                    <span>{course.duration} hours</span>
                  </div>
                  <div className="meta-item">
                    <FiAward />
                    <span>Certificate</span>
                  </div>
                </div>

                <div className="course-instructor">
                  <strong>Instructor:</strong> {course.instructorName}
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Course Content */}
      <Container className="py-5">
        <Row>
          <Col lg={8}>
            {/* Course Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-4"
            >
              <img 
                src={course.image || 'https://via.placeholder.com/800x450/1E3A8A/FFFFFF?text=Course'} 
                alt={course.title}
                className="course-detail-image"
              />
            </motion.div>

            {/* What You'll Learn */}
            <div className="content-section mb-4">
              <h3 className="section-title">What You'll Learn</h3>
              <ul className="learning-list">
                <li>Master the fundamentals and advanced concepts</li>
                <li>Build real-world projects from scratch</li>
                <li>Understand best practices and industry standards</li>
                <li>Get hands-on experience with modern tools</li>
                <li>Learn problem-solving techniques</li>
                <li>Gain confidence to work on professional projects</li>
              </ul>
            </div>

            {/* Course Content */}
            <div className="content-section mb-4">
              <h3 className="section-title">Course Content</h3>
              <p className="text-muted">This course includes comprehensive lessons covering all essential topics.</p>
            </div>

            {/* Requirements */}
            <div className="content-section mb-4">
              <h3 className="section-title">Requirements</h3>
              <ul>
                <li>Basic computer knowledge</li>
                <li>Willingness to learn</li>
                <li>No prior experience required</li>
              </ul>
            </div>

            {/* Share Section */}
            <div className="content-section mb-4">
              <h3 className="section-title">Share This Course</h3>
              <div className="social-share-buttons">
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => shareOnSocial('facebook')}
                >
                  <FaFacebook /> Facebook
                </Button>
                <Button 
                  variant="outline-info" 
                  size="sm"
                  onClick={() => shareOnSocial('twitter')}
                >
                  <FaTwitter /> Twitter
                </Button>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => shareOnSocial('linkedin')}
                >
                  <FaLinkedin /> LinkedIn
                </Button>
                <Button 
                  variant="outline-success" 
                  size="sm"
                  onClick={() => shareOnSocial('whatsapp')}
                >
                  <FaWhatsapp /> WhatsApp
                </Button>
              </div>
            </div>

            {/* Reviews Section (Static) */}
            <div className="content-section">
              <h3 className="section-title">Student Reviews</h3>
              <div className="reviews-placeholder">
                <p className="text-muted">Reviews functionality coming soon...</p>
              </div>
            </div>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            <div className="course-sidebar">
              <div className="price-card">
                <h2 className="price">${course.price}</h2>
                
                <div className="d-grid gap-2 mb-3">
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={buyNow}
                  >
                    Buy Now
                  </Button>
                  
                  <Button 
                    variant={isInCart ? "outline-secondary" : "outline-primary"}
                    size="lg"
                    onClick={addToCart}
                    disabled={isInCart}
                  >
                    <FiShoppingCart /> {isInCart ? 'Added to Cart' : 'Add to Cart'}
                  </Button>
                </div>

                <div className="course-includes">
                  <h4>This course includes:</h4>
                  <ul>
                    <li><FiClock /> {course.duration} hours on-demand video</li>
                    <li><FiAward /> Certificate of completion</li>
                    <li><FiUsers /> Lifetime access</li>
                    <li><FiShare2 /> Access on mobile and desktop</li>
                  </ul>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Similar Courses */}
        {similarCourses.length > 0 && (
          <div className="mt-5">
            <h3 className="mb-4">More Like This Course</h3>
            <Row className="g-4">
              {similarCourses.map((similarCourse, index) => (
                <Col lg={3} md={6} key={similarCourse.id}>
                  <CourseCard course={similarCourse} delay={index * 0.1} />
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
