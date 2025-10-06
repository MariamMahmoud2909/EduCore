import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { Container, Row, Col } from 'react-bootstrap';
import { FiArrowRight, FiPlay, FiBook, FiUsers, FiAward } from 'react-icons/fi';
import CourseCard from '../components/shared/CategoryCard';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { courseService, instructorService, categoryService, dashboardService } from '../services/api';
import './LandingPage.css';

const LandingPage = () => {
  const [stats, setStats] = useState({});
  const [topCourses, setTopCourses] = useState([]);
  const [topInstructors, setTopInstructors] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startCounting, setStartCounting] = useState(false);

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
        dashboardService.getStats(),
        courseService.getTopCourses(),
        instructorService.getTopInstructors(),
        categoryService.getTopCategories()
      ]);
      
      setStats(statsRes.data);
      setTopCourses(coursesRes.data);
      setTopInstructors(instructorsRes.data);
      setTopCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching landing data:', error);
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
                  <span className="gradient-text">ByWay</span>
                </h1>
                <p className="hero-description">
                  Welcome to ByWay, where learning knows no bounds. We believe that
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
                        <CountUp end={stats.coursesCount || 0} duration={2} suffix="+" />
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
                        <CountUp end={stats.studentsCount || 0} duration={2} suffix="+" />
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
                    <CountUp end={stats.coursesCount || 0} duration={2.5} suffix="+" />
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
                    <CountUp end={stats.instructorsCount || 0} duration={2.5} suffix="+" />
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
                    <CountUp end={stats.studentsCount || 0} duration={2.5} suffix="+" />
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
                    <CountUp end={stats.categoriesCount || 0} duration={2.5} suffix="+" />
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
                <motion.div
                  className="category-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <div className="category-image">
                    <img 
                      src={category.image || `https://via.placeholder.com/300x200/1E3A8A/FFFFFF?text=${category.name}`} 
                      alt={category.name}
                    />
                  </div>
                  <div className="category-content">
                    <h3 className="category-name">{category.name}</h3>
                    <p className="category-courses">{Math.floor(Math.random() * 50) + 10} Courses</p>
                  </div>
                </motion.div>
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
            {topCourses.slice(0, 6).map((course, index) => (
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
                      src={instructor.image || `https://ui-avatars.com/api/?name=${instructor.firstName}+${instructor.lastName}&size=200&background=1E3A8A&color=fff`} 
                      alt={`${instructor.firstName} ${instructor.lastName}`}
                    />
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
            <Link to="/register" className="btn btn-secondary btn-lg">
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
    4: 'UX/UI Designer'
  };
  return titles[jobTitle] || 'Instructor';
};

export default LandingPage;