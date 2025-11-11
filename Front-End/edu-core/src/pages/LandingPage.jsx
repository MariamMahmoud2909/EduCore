import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { Container, Row, Col } from 'react-bootstrap';
import { FiArrowRight, FiPlay, FiBook, FiUsers, FiAward, FiStar } from 'react-icons/fi';
import CourseCard from '../components/shared/CourseCard';
import CategoryCard from '../components/shared/CategoryCard';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { courseService, instructorService, categoryService, dashboardService } from '../services/api';
import './LandingPage.css';
const BASE_URL = "https://mariam2909-001-site1.anytempurl.com";
const LandingPage = () => {
  const [stats, setStats] = useState({});
  const [topCourses, setTopCourses] = useState([]);
  const [topInstructors, setTopInstructors] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startCounting, setStartCounting] = useState(false);

  // Static reviews data
  const reviews = [
    {
      id: 1,
      name: 'Sarah Attia',
      role: 'Web Developer',
      image: 'https://ui-avatars.com/api/?name=Sarah+Johnson&size=100&background=FF6B6B&color=fff',
      rating: 5,
      review: 'EduCore transformed my career! The courses are well-structured and the instructors are incredibly knowledgeable. Highly recommended!',
      course: 'Full Stack Development'
    },
    {
      id: 2,
      name: 'Nour Khaled',
      role: 'Product Manager',
      image: 'https://ui-avatars.com/api/?name=Michael+Chen&size=100&background=4ECDC4&color=fff',
      rating: 5,
      review: 'Amazing learning experience. The practical projects helped me land my dream job. The community support is fantastic!',
      course: 'Product Management 101'
    },
    {
      id: 3,
      name: 'Shahd Osama',
      role: 'UI/UX Designer',
      image: 'https://ui-avatars.com/api/?name=Emma+Williams&size=100&background=95E1D3&color=fff',
      rating: 5,
      review: 'Excellent course content and expert instructors. The design fundamentals course really elevated my skills to the next level.',
      course: 'UI/UX Design'
    },
    {
      id: 4,
      name: 'Abdullah Mohamed',
      role: 'Data Scientist',
      image: 'https://ui-avatars.com/api/?name=David+Kumar&size=100&background=F38181&color=fff',
      rating: 5,
      review: 'Top-notch instructors and comprehensive curriculum. I was able to apply what I learned immediately in my job.',
      course: 'Data Science Bootcamp'
    }
  ];

  useEffect(() => {
    fetchLandingData();
    
    // Start counting animation after a short delay
    const timer = setTimeout(() => {
      setStartCounting(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const fetchLandingData = async () => {
    try {
      const [statsRes, coursesRes, instructorsRes, categoriesRes] = await Promise.all([
        dashboardService.getStats().catch(err => ({ data: {} })),
        courseService.getTopCourses().catch(err => ({ data: [] })),
        instructorService.getTopInstructors().catch(err => ({ data: [] })),
        categoryService.getTopCategories().catch(err => ({ data: [] }))
      ]);
      
      setStats(statsRes.data || {});
      setTopCourses(coursesRes.data || []);
      setTopInstructors(instructorsRes.data || []);
      setTopCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error fetching landing data:', error);
      setStats({});
      setTopCourses([]);
      setTopInstructors([]);
      setTopCategories([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="hero-title">
                  Unlock Your Potential with{' '}
                  <span className="gradient-text">EduCore</span>
                </h1>
                <p className="hero-description">
                  Welcome to EduCore, where learning knows no bounds. We believe that
                  education is the key to personal and professional growth, and we're
                  here to guide you on your journey to success.
                </p>
                <div className="hero-buttons">
                  <Link to="/courses" className="btn btn-primary btn-lg">
                    Start Learning <FiArrowRight />
                  </Link>
                  <button className="btn btn-outline btn-lg">
                    <FiPlay /> Watch Demo
                  </button>
                </div>
              </motion.div>
            </Col>

            <Col lg={6}>
              <motion.div 
                className="hero-image"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop" 
                  alt="Students learning"
                />
                
                {/* Floating Stats Cards with CountUp */}
                <motion.div 
                  className="floating-card card-1"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <FiBook className="card-icon" />
                  <div>
                    <p className="card-number">
                      {startCounting && (
                        <CountUp end={50} duration={2} suffix="+" />
                      )}
                    </p>
                    <p className="card-label">Courses</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="floating-card card-2"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                >
                  <FiUsers className="card-icon" />
                  <div>
                    <p className="card-number">
                      {startCounting && (
                        <CountUp end={5000} duration={2} suffix="+" />
                      )}
                    </p>
                    <p className="card-label">Students</p>
                  </div>
                </motion.div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section with CountUp Animation */}
      <section className="stats-section">
        <Container>
          <Row className="g-4">
            <Col md={6} lg={3}>
              <motion.div 
                className="stat-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="stat-icon" style={{ background: '#DBEAFE' }}>
                  <FiBook size={32} color="#1E3A8A" />
                </div>
                <h3 className="stat-number">
                  {startCounting && (
                    <CountUp end={50} duration={2.5} suffix="+" />
                  )}
                </h3>
                <p className="stat-label">Online Courses</p>
              </motion.div>
            </Col>

            <Col md={6} lg={3}>
              <motion.div 
                className="stat-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="stat-icon" style={{ background: '#FFEDD5' }}>
                  <FiUsers size={32} color="#F97316" />
                </div>
                <h3 className="stat-number">
                  {startCounting && (
                    <CountUp end={200} duration={2.5} suffix="+" />
                  )}
                </h3>
                <p className="stat-label">Expert Instructors</p>
              </motion.div>
            </Col>

            <Col md={6} lg={3}>
              <motion.div 
                className="stat-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="stat-icon" style={{ background: '#D1FAE5' }}>
                  <FiAward size={32} color="#10B981" />
                </div>
                <h3 className="stat-number">
                  {startCounting && (
                    <CountUp end={5000} duration={2.5} suffix="+" />
                  )}
                </h3>
                <p className="stat-label">Active Students</p>
              </motion.div>
            </Col>

            <Col md={6} lg={3}>
              <motion.div 
                className="stat-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="stat-icon" style={{ background: '#FEE2E2' }}>
                  <FiBook size={32} color="#EF4444" />
                </div>
                <h3 className="stat-number">
                  {startCounting && (
                    <CountUp end={20} duration={2.5} suffix="+" />
                  )}
                </h3>
                <p className="stat-label">Categories</p>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Top Categories */}
      <section className="categories-section">
        <Container>
          <div className="section-header">
            <h2 className="section-title">Top Categories</h2>
            <Link to="/courses" className="section-link">
              View All <FiArrowRight />
            </Link>
          </div>

          <Row className="g-4">
            {topCategories.map((category, index) => (
              <Col lg={3} md={6} key={category.id}>
                <CategoryCard 
                  category={category} 
                  delay={index * 0.1}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Top Courses */}
      <section className="courses-section">
        <Container>
          <div className="section-header">
            <h2 className="section-title">Featured Courses</h2>
            <Link to="/courses" className="section-link">
              View All <FiArrowRight />
            </Link>
          </div>

          <Row className="g-4">
            {topCourses.slice(2, 9).map((course, index) => (
              <Col lg={4} md={6} key={course.id}>
                <CourseCard course={course} delay={index * 0.1} />
              </Col>
            ))}
          </Row>

          <div className="text-center mt-5">
            <Link to="/courses" className="btn btn-primary btn-lg">
              Explore More Courses <FiArrowRight />
            </Link>
          </div>
        </Container>
      </section>

      {/* Top Instructors */}
      <section className="instructors-section">
        <Container>
          <div className="section-header">
            <h2 className="section-title">Meet Our Instructors</h2>
            <p className="section-subtitle">Learn from industry experts</p>
          </div>

          <Row className="g-4">
            {topInstructors.map((instructor, index) => (
              <Col lg={3} md={6} key={instructor.id}>
                <motion.div
                  className="instructor-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="instructor-image">
                    <img 
                      src={`${BASE_URL}${instructor.image}`}
                      alt={`${instructor.firstName} ${instructor.lastName}`}
                    />
                    {/* <img 
                    src={`${BASE_URL}/assets/images/instructors/${instructor.image}`}
                      //src={instructor.image || `https://ui-avatars.com/api/?name=${instructor.firstName}+${instructor.lastName}&size=200&background=1E3A8A&color=fff`} 
                      alt={`${instructor.firstName} ${instructor.lastName}`}
                    /> */}
                  </div>
                  <div className="instructor-info">
                    <h3 className="instructor-name">{instructor.firstName} {instructor.lastName}</h3>
                    <p className="instructor-title">{getJobTitleName(instructor.jobTitle)}</p>
                    <p className="instructor-bio">{instructor.bio?.substring(0, 80)}...</p>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section">
        <Container>
          <motion.div
            className="section-header text-center mb-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">What Our Students Say</h2>
            <p className="section-subtitle">
              Join thousands of satisfied learners who transformed their careers with EduCore
            </p>
          </motion.div>

          <Row className="g-4">
            {reviews.map((review, index) => (
              <Col lg={6} key={review.id}>
                <motion.div
                  className="review-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  {/* Star Rating */}
                  <div className="review-rating">
                    {[...Array(review.rating)].map((_, i) => (
                      <FiStar
                        key={i}
                        size={18}
                        className="star-icon"
                        style={{ fill: '#FCD34D', color: '#FCD34D' }}
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="review-text">
                    "{review.review}"
                  </p>

                  {/* Reviewer Info */}
                  <div className="review-author">
                    <img
                      src={review.image}
                      alt={review.name}
                      className="reviewer-avatar"
                    />
                    <div className="reviewer-details">
                      <h4 className="reviewer-name">{review.name}</h4>
                      <p className="reviewer-role">{review.role}</p>
                      <span className="reviewer-course">{review.course}</span>
                    </div>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>

          {/* Review Stats */}
          <motion.div
            className="review-stats mt-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Row className="text-center g-4">
              <Col md={4}>
                <div className="stat-badge">
                  <h3 className="stat-big-number">4.9/5</h3>
                  <p className="stat-label">Average Rating</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="stat-badge">
                  <h3 className="stat-big-number">98%</h3>
                  <p className="stat-label">Student Satisfaction</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="stat-badge">
                  <h3 className="stat-big-number">5K+</h3>
                  <p className="stat-label">5-Star Reviews</p>
                </div>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <Container>
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="cta-title">Start Your Learning Journey Today</h2>
            <p className="cta-description">
              Join thousands of students learning new skills and advancing their careers
            </p>
            <Link to="/courses" className="btn btn-secondary btn-lg">
              Get Started Now <FiArrowRight />
            </Link>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

const getJobTitleName = (jobTitle) => {
  const titles = {
    1: 'Fullstack Developer',
    2: 'Backend Developer',
    3: 'Frontend Developer',
    4: 'UX/UI Designer',
    5: 'AiEngineer',
    6: 'DataScientist',
    7: 'MobileDeveloper',
    8: 'MarketingSpecialist',
    9: 'CloudEngineer',
    10:'SecurityAnalyst'
  };
  return titles[jobTitle] || 'Instructor';
};

export default LandingPage;