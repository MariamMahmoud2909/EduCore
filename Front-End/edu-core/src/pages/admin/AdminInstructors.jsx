import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Sidebar from '../../components/layout/Sidebar';
import InstructorTable from '../../components/admin/InstructorTable';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { instructorService } from '../../services/api';
import './AdminPages.css';

const AdminInstructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    jobTitle: '',
    image: ''
  });

  useEffect(() => {
    fetchInstructors();
  }, [currentPage, searchTerm]);

  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const response = await instructorService.getInstructors({ 
        page: currentPage, 
        pageSize: 10,
        search: searchTerm 
      });
      setInstructors(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching instructors:', error);
      toast.error('Failed to load instructors');
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (instructor = null) => {
    if (instructor) {
      setEditingInstructor(instructor);
      setFormData({
        firstName: instructor.firstName,
        lastName: instructor.lastName,
        email: instructor.email,
        bio: instructor.bio || '',
        jobTitle: instructor.jobTitle.toString(),
        image: instructor.image || ''
      });
    } else {
      setEditingInstructor(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        bio: '',
        jobTitle: '',
        image: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingInstructor(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const instructorData = {
        ...formData,
        jobTitle: parseInt(formData.jobTitle)
      };

      if (editingInstructor) {
        await instructorService.updateInstructor(editingInstructor.id, instructorData);
        toast.success('Instructor updated successfully!');
      } else {
        await instructorService.createInstructor(instructorData);
        toast.success('Instructor created successfully!');
      }
      
      handleCloseModal();
      fetchInstructors();
    } catch (err) {
      toast.error(err.response?.data || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (instructorId) => {
    if (window.confirm('Are you sure you want to delete this instructor?')) {
      try {
        await instructorService.deleteInstructor(instructorId);
        toast.success('Instructor deleted successfully!');
        fetchInstructors();
      } catch (error) {
        toast.error('Cannot delete instructor with assigned courses');
      }
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <Container fluid>
          <div className="admin-header">
            <div>
              <h1 className="admin-title">Instructors Management</h1>
              <p className="admin-subtitle">Manage all instructors on the platform</p>
            </div>
            <Button variant="primary" onClick={() => handleShowModal()}>
              <FiPlus /> Add Instructor
            </Button>
          </div>

          <div className="admin-toolbar">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Search instructors..."
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
              <InstructorTable
                instructors={instructors}
                onEdit={handleShowModal}
                onDelete={handleDelete}
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

          {/* Instructor Modal */}
          <Modal show={showModal} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>{editingInstructor ? 'Edit Instructor' : 'Add Instructor'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Job Title</Form.Label>
                  <Form.Select
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Job Title</option>
                    <option value="1">Fullstack Developer</option>
                    <option value="2">Backend Developer</option>
                    <option value="3">Frontend Developer</option>
                    <option value="4">UX/UI Designer</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Brief description about the instructor..."
                  />
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
                    {loading ? 'Saving...' : (editingInstructor ? 'Update Instructor' : 'Add Instructor')}
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

export default AdminInstructors;