import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FiBook, FiUsers, FiDollarSign, FiShoppingBag, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Sidebar from '../../components/layout/Sidebar';
import StatCard from '../../components/admin/StatCard';
import { dashboardService } from '../../services/api';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import './AdminPages.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardService.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <Container fluid>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="admin-header">
              <h1 className="admin-title">Dashboard</h1>
              <p className="admin-subtitle">Welcome back! Here's what's happening today.</p>
            </div>

            <Row className="g-4 mb-4">
              <Col lg={3} md={6}>
                <StatCard
                  title="Total Courses"
                  value={stats.coursesCount || 0}
                  icon={FiBook}
                  color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  delay={0}
                />
              </Col>
              <Col lg={3} md={6}>
                <StatCard
                  title="Total Instructors"
                  value={stats.instructorsCount || 0}
                  icon={FiUsers}
                  color="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                  delay={0.1}
                />
              </Col>
              <Col lg={3} md={6}>
                <StatCard
                  title="Active Students"
                  value={stats.studentsCount || 0}
                  icon={FiUser}
                  color="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                  delay={0.2}
                />
              </Col>
              <Col lg={3} md={6}>
                <StatCard
                  title="Monthly Orders"
                  value={stats.monthlySubscriptions || 0}
                  icon={FiShoppingBag}
                  color="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                  delay={0.3}
                />
              </Col>
            </Row>

            <Row className="g-4">
              <Col lg={6}>
                <motion.div
                  className="dashboard-card"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h3 className="card-title">Recent Activity</h3>
                  <div className="activity-list">
                    <div className="activity-item">
                      <div className="activity-icon bg-primary">
                        <FiBook color="white" />
                      </div>
                      <div className="activity-content">
                        <p className="activity-text">New course added</p>
                        <span className="activity-time">2 hours ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon bg-success">
                        <FiUser color="white" />
                      </div>
                      <div className="activity-content">
                        <p className="activity-text">New student registered</p>
                        <span className="activity-time">5 hours ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon bg-warning">
                        <FiShoppingBag color="white" />
                      </div>
                      <div className="activity-content">
                        <p className="activity-text">Course purchased</p>
                        <span className="activity-time">1 day ago</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Col>

              <Col lg={6}>
                <motion.div
                  className="dashboard-card"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <h3 className="card-title">Quick Actions</h3>
                  <div className="quick-actions">
                    <a href="/admin/courses" className="quick-action-btn">
                      <FiBook size={24} />
                      <span>Manage Courses</span>
                    </a>
                    <a href="/admin/instructors" className="quick-action-btn">
                      <FiUsers size={24} />
                      <span>Manage Instructors</span>
                    </a>
                    <a href="/admin/users" className="quick-action-btn">
                      <FiUser size={24} />
                      <span>Manage Users</span>
                    </a>
                  </div>
                </motion.div>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </div>
    </div>
  );
};

export default AdminDashboard;