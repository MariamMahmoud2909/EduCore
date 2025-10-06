import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import CourseCard from '../components/shared/CategoryCard';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { courseService, categoryService } from '../services/api';
import './CoursesPage.css';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    level: '',
    minPrice: '',
    maxPrice: '',
    page: 1,
    pageSize: 12
  });
  const [totalPages, setTotalPages] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {
        page: filters.page,
        pageSize: filters.pageSize,
        search: filters.search || undefined,
        categoryId: filters.categoryId || undefined,
        level: filters.level || undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined
      };

      const response = await courseService.getCourses(params);
      setCourses(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      page: 1
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      categoryId: '',
      level: '',
      minPrice: '',
      maxPrice: '',
      page: 1,
      pageSize: 12
    });
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="courses-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Explore Courses</h1>
          <p className="page-subtitle">
            Discover thousands of courses taught by expert instructors
          </p>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search for courses..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          <button 
            className="filter-toggle-btn mobile-only"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <FiFilter /> Filters
          </button>
        </div>

        <div className="courses-layout">
          {/* Filters Sidebar */}
          <aside className={`filters-sidebar ${showMobileFilters ? 'show' : ''}`}>
            <div className="filters-header">
              <h3>Filters</h3>
              <button 
                className="clear-filters-btn"
                onClick={handleClearFilters}
              >
                Clear All
              </button>
              <button 
                className="close-filters-btn mobile-only"
                onClick={() => setShowMobileFilters(false)}
              >
                <FiX />
              </button>
            </div>

            {/* Category Filter */}
            <div className="filter-group">
              <label className="filter-label">Category</label>
              <select
                className="filter-select"
                value={filters.categoryId}
                onChange={(e) => handleFilterChange('categoryId', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div className="filter-group">
              <label className="filter-label">Level</label>
              <select
                className="filter-select"
                value={filters.level}
                onChange={(e) => handleFilterChange('level', e.target.value)}
              >
                <option value="">All Levels</option>
                <option value="1">Beginner</option>
                <option value="2">Intermediate</option>
                <option value="3">Expert</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <label className="filter-label">Price Range</label>
              <div className="price-inputs">
                <input
                  type="number"
                  className="price-input"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
                <span>-</span>
                <input
                  type="number"
                  className="price-input"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>
            </div>
          </aside>

          {/* Courses Grid */}
          <div className="courses-content">
            {/* Results Count */}
            <div className="results-header">
              <p className="results-count">
                Showing {courses.length} of {totalPages * filters.pageSize} courses
              </p>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : courses.length > 0 ? (
              <>
                <div className="courses-grid">
                  {courses.map((course, index) => (
                    <CourseCard key={course.id} course={course} delay={index * 0.05} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      disabled={filters.page === 1}
                      onClick={() => handlePageChange(filters.page - 1)}
                    >
                      Previous
                    </button>

                    <div className="pagination-numbers">
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index + 1}
                          className={`pagination-number ${filters.page === index + 1 ? 'active' : ''}`}
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      className="pagination-btn"
                      disabled={filters.page === totalPages}
                      onClick={() => handlePageChange(filters.page + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-results">
                <p>No courses found matching your criteria</p>
                <button className="btn btn-primary" onClick={handleClearFilters}>
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div 
          className="filters-overlay mobile-only"
          onClick={() => setShowMobileFilters(false)}
        />
      )}
    </div>
  );
};

export default CoursesPage;