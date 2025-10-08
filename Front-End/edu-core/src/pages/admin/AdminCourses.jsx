import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Sidebar from '../../components/layout/Sidebar';
import CourseTable from '../../components/admin/CourseTable';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { courseService, instructorService, categoryService } from '../../services/api';
import './AdminPages.css';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    level: '',
    duration: '',
    categoryId: '',
    instructorId: '',
    image: ''
  });

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesRes, instructorsRes, categoriesRes] = await Promise.all([
        courseService.getCourses({ 
          page: currentPage, 
          pageSize: 10,
          search: searchTerm 
        }),
        instructorService.getInstructors({ page: 1, pageSize: 100 }),
        categoryService.getCategories()
      ]);
      
      setCourses(coursesRes.data.items);
      setTotalPages(coursesRes.data.totalPages);
      setInstructors(instructorsRes.data.items || instructorsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title,
        description: course.description,
        price: course.price.toString(),
        level: course.level.toString(),
        duration: course.duration.toString(),
        categoryId: course.categoryId?.toString() || '',
        instructorId: course.instructorId,
        image: course.image || ''
      });
    } else {
      setEditingCourse(null);
      setFormData({
        title: '',
        description: '',
        price: '',
        level: '',
        duration: '',
        categoryId: '',
        instructorId: '',
        image: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCourse(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const courseData = {
        ...formData,
        price: parseFloat(formData.price),
        level: parseInt(formData.level),
        duration: parseInt(formData.duration),
        categoryId: parseInt(formData.categoryId)
      };

      if (editingCourse) {
        await courseService.updateCourse(editingCourse.id, courseData);
        toast.success('Course updated successfully!');
      } else {
        await courseService.createCourse(courseData);
        toast.success('Course created successfully!');
      }
      
      handleCloseModal();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseService.deleteCourse(courseId);
        toast.success('Course deleted successfully!');
        fetchData();
      } catch (error) {
        toast.error('Cannot delete course that has been purchased');
      }
    }
  };

  const handleView = (course) => {
    window.open(`/courses/${course.id}`, '_blank');
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <Container fluid>
          <div className="admin-header">
            <div>
              <h1 className="admin-title">Courses Management</h1>
              <p className="admin-subtitle">Manage all courses on the platform</p>
            </div>
            <Button variant="primary" onClick={() => handleShowModal()}>
              <FiPlus /> Add Course
            </Button>
          </div>

          <div className="admin-toolbar">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <CourseTable
                courses={courses}
                onEdit={handleShowModal}
                onDelete={handleDelete}
                onView={handleView}
              />

              {totalPages > 1 && (
                <div className="pagination-wrapper">
                  <Button
                    variant="outline-primary"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <span className="page-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline-primary"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Course Modal */}
          <Modal show={showModal} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>{editingCourse ? 'Edit Course' : 'Add Course'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Price ($)</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Duration (hours)</Form.Label>
                      <Form.Control
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Level</Form.Label>
                      <Form.Select
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Level</option>
                        <option value="1">Beginner</option>
                        <option value="2">Intermediate</option>
                        <option value="3">Expert</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Instructor</Form.Label>
                  <Form.Select
                    name="instructorId"
                    value={formData.instructorId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Instructor</option>
                    {instructors.map(instructor => (
                      <option key={instructor.id} value={instructor.id}>
                        {instructor.firstName} {instructor.lastName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </Form.Group>

                <div className="d-flex justify-content-end gap-2">
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Saving...' : (editingCourse ? 'Update Course' : 'Add Course')}
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>
        </Container>
      </div>
    </div>
  );
};

export default AdminCourses;