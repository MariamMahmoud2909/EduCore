import axios from 'axios';

//const API_BASE_URL = 'https://localhost:7128/api';
const API_BASE_URL = 'https://mariam2909-001-site1.anytempurl.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: (credentials) => api.post('/Auth/login', credentials),
  register: (userData) => api.post('/Auth/register', userData),
  //logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/Auth/me'),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';},
  externalLogin: (provider) => api.get(`/Auth/external-login/${provider}`),
  externalCallback: () => api.get('/Auth/external-callback'),
  getExternalProviders: () => api.get('/Auth/external-providers'),
};

// Cart Services
export const cartService = {
  addToCart: (courseId) => api.post('/Cart', { courseId }),
  getCart: () => api.get('/Cart'),
  removeFromCart: (courseId) => api.delete(`/Cart/${courseId}`),
  clearCart: () => api.delete('/Cart'),
  //updateQuantity: (courseId, quantity) => api.put(`/Cart/${courseId}`, { quantity }),
};

// Category Services
export const categoryService = {
  getCategories: () => api.get('/categories'),
  getCategory: (id) => api.get(`/Categories/${id}`),
  getTopCategories: () => api.get('/Categories/top'),
  //getCategoryCourses: (id) => api.get(`/categories/${id}/courses`),
};

// Course Services
export const courseService = {
  getCourses: (params) => api.get('/Courses', { params }),
  getCourse: (id) => api.get(`/Courses/${id}`),
  getTopCourses: () => api.get('/Courses/TopCourses'),
  getFeaturedCourses: () => api.get('/Courses/featured'),
  getSimilarCourses: (id) => api.get(`/Courses/${id}/similar`),
  searchCourses: (query) => api.get('/Courses/search', { params: { q: query } }),
  createCourse: (data) => api.post('/Courses', data),
  updateCourse: (id, data) => api.put(`/Courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/Courses/${id}`),
};

// Dashboard Services (Admin)
export const dashboardService = {
  getStats: () => api.get('/Dashboard/stats'),
  getRecentActivities: () => api.get('/Dashboard/activities'),
  getSalesReport: (period) => api.get('/Dashboard/sales', { params: { period } }),
  getPopularCourses: () => api.get('/Dashboard/popular-courses'),
};

// Enrollment Services
export const enrollmentService = {
  enrollCourse: (courseId) => api.post('/Enrollments', { courseId }),
  getMyEnrollments: () => api.get('/Enrollments/my-courses'),
  getEnrollmentProgress: (courseId) => api.get(`/Enrollments/${courseId}/progress`),
  updateProgress: (courseId, progressData) => api.put(`/Enrollments/${courseId}/progress`, progressData),
};

// Instructor Services
export const instructorService = {
  getInstructors: (params) => api.get('/Instructors', { params }),
  getInstructor: (id) => api.get(`/Instructors/${id}`),
  getTopInstructors: () => api.get('/Instructors/top'),
  getInstructorCourses: (id) => api.get(`/Instructors/${id}/courses`),
  createInstructor: (data) => api.post('/Instructors', data),
  updateInstructor: (id, data) => api.put(`/Instructors/${id}`, data),
  deleteInstructor: (id) => api.delete(`/Instructors/${id}`),
};

// Order Services
export const orderService = {
  createOrder: (orderData) => api.post('/Orders', orderData),
  checkout: (paymentData) => api.post('/Orders/checkout', paymentData),
  getOrders: (params) => api.get('/Orders', { params }),
  getOrder: (id) => api.get(`/Orders/${id}`),
  getUserOrders: () => api.get('/Orders/my-orders'),
  updateOrderStatus: (id, status) => api.put(`/Orders/${id}/status`, { status }),
};

// Payment Services
export const paymentService = {
  processPayment: (paymentData) => api.post('/Payments/process', paymentData),
  getPaymentMethods: () => api.get('/Payments/methods'),
  savePaymentMethod: (methodData) => api.post('/Payments/methods', methodData),
  deletePaymentMethod: (methodId) => api.delete(`/Payments/methods/${methodId}`),
};

// Review Services
export const reviewService = {
  getCourseReviews: (courseId, params) => api.get(`/courses/${courseId}/Reviews`, { params }),
  createReview: (courseId, reviewData) => api.post(`/courses/${courseId}/Reviews`, reviewData),
  getCourseReviewById: (reviewId) => api.put(`/courses/${courseId}/Reviews/${reviewId}`),
  updateReview: (reviewId, reviewData) => api.put(`/courses/${courseId}/Reviews/${reviewId}`, reviewData),
  deleteReview: (reviewId) => api.delete(`/courses/${courseId}/Reviews/${reviewId}`),
};

// User Services
export const userService = {
  getUsers: (params) => api.get('/Users', { params }),
  getUser: (id) => api.get(`/Users/${id}`),
  getUserProfile: () => api.get('/Users/profile'),
  updateUserProfile: (data) => api.put('/Users/profile', data),
  getUserStats: (id) => api.get(`/Users/${id}/stats`),
  deleteUser: (id) => api.delete(`/Users/${id}`),
  toggleAdminRole: (id, isAdmin) => api.put(`/Users/${id}/toggle-admin`, { isAdmin }),
  changePassword: (data) => api.put('/Users/change-password', data),
};

export default api;