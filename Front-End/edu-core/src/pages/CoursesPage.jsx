import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useAtom } from 'jotai';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { toast } from 'react-toastify';
import CourseCard from '../components/courses/CourseCard';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Pagination from '../components/shared/Pagination';
import { courseService, categoryService } from '../services/api';
import { 
  searchQueryAtom, 
  selectedCategoryAtom, 
  sortByAtom,
  currentPageAtom,
  itemsPerPageAtom 
} from '../store/atoms';
import './CoursesPage.css';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom);
  const [sortBy, setSortBy] = useAtom(sortByAtom);
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
  const [itemsPerPage] = useAtom(itemsPerPageAtom);
  
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [showFilters, setShowFilters] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch courses when filters change
  useEffect(() => {
    fetchCourses();
  }, [searchQuery, selectedCategory, sortBy, currentPage, priceRange]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        pageSize: itemsPerPage,
        search: searchQuery || undefined,
        categoryId: (selectedCategory && selectedCategory !== 'All') ? selectedCategory : undefined,
        sortBy: sortBy,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
      };

      // Remove undefined values to avoid sending them to backend
      Object.keys(params).forEach(key => 
        (params[key] === undefined || params[key] === '') && delete params[key]
      );

      const response = await courseService.getCourses(params);
      
      // Handle PagedResult response from backend
      if (response.data.items) {
        setCourses(response.data.items);
        setTotalPages(response.data.totalPages || 1);
        setTotalCourses(response.data.totalCount || 0);
      } else if (Array.isArray(response.data)) {
        setCourses(response.data);
        setTotalPages(1);
        setTotalCourses(response.data.length);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses. Please try again.');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCourses();
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handlePriceRangeChange = () => {
    setCurrentPage(1);
    fetchCourses();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSortBy('popular');
    setPriceRange({ min: 0, max: 1000 });
    setCurrentPage(1);
  };

  return (
    <div className="courses-page">
      <div className="courses-hero">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="page-title">Explore Our Courses</h1>
            <p className="page-subtitle">
              Discover {totalCourses} courses from expert instructors
            </p>

            {/* Search Bar */}
            <Form onSubmit={handleSearch} className="search-form">
              <div className="search-input-wrapper">
                <FiSearch className="search-icon" />
                <Form.Control
                  type="text"
                  placeholder="Search for courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <Button type="submit" variant="primary">
                  Search
                </Button>
              </div>
            </Form>
          </motion.div>
        </Container>
      </div>

      <Container className="courses-content">
        <Row>
          {/* Filters Sidebar */}
          <Col lg={3}>
            <motion.div
              className="filters-sidebar"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="filters-header">
                <h3>
                  <FiFilter /> Filters
                </h3>
                <Button 
                  variant="link" 
                  size="sm"
                  onClick={clearFilters}
                >
                  Clear All
                </Button>
              </div>

              {/* Categories */}
              <div className="filter-section">
                <h4>Categories</h4>
                <div className="category-list">
                  {categories.map((category) => (
                    <Form.Check
                      key={category.id}
                      type="checkbox"
                      id={`category-${category.id}`}
                      label={`${category.name} (${category.courseCount || 0})`}
                      checked={selectedCategory === category.id}
                      onChange={() => handleCategoryChange(category.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="filter-section">
                <h4>Price Range</h4>
                <Form.Group className="mb-3">
                  <Form.Label>Min: ${priceRange.min}</Form.Label>
                  <Form.Range
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) })}
                    onMouseUp={handlePriceRangeChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Max: ${priceRange.max}</Form.Label>
                  <Form.Range
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                    onMouseUp={handlePriceRangeChange}
                  />
                </Form.Group>
              </div>
            </motion.div>
          </Col>

          {/* Courses Grid */}
          <Col lg={9}>
            {/* Sort Bar */}
            <div className="sort-bar">
              <p className="results-count">
                Showing {courses.length} of {totalCourses} courses
              </p>
              <Form.Select 
                value={sortBy} 
                onChange={handleSortChange}
                className="sort-select"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </Form.Select>
            </div>

            {/* Loading State */}
            {loading ? (
              <LoadingSpinner />
            ) : courses.length === 0 ? (
              <motion.div
                className="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h3>No courses found</h3>
                <p>Try adjusting your filters or search query</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </motion.div>
            ) : (
              <>
                {/* Courses Grid */}
                <Row className="g-4">
                  {courses.map((course, index) => (
                    <Col key={course.id} lg={4} md={6}>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <CourseCard course={course} />
                      </motion.div>
                    </Col>
                  ))}
                </Row>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-5">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CoursesPage;