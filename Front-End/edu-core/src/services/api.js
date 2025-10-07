import axios from 'axios';

// Update to match your backend URL
const API_BASE_URL = 'https://localhost:7128/api';

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
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  }
};

// Course Services
export const courseService = {
  getCourses: (params) => api.get('/courses', { params }),
  getCourse: (id) => api.get(`/courses/${id}`),
  getTopCourses: () => api.get('/courses/top'),
  getFeaturedCourses: () => api.get('/courses/featured'),
  getSimilarCourses: (id) => api.get(`/courses/${id}/similar`),
  searchCourses: (query) => api.get('/courses/search', { params: { q: query } }),
  createCourse: (data) => api.post('/courses', data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
};

// Instructor Services
export const instructorService = {
  getInstructors: (params) => api.get('/instructors', { params }),
  getInstructor: (id) => api.get(`/instructors/${id}`),
  getTopInstructors: () => api.get('/instructors/top'),
  getInstructorCourses: (id) => api.get(`/instructors/${id}/courses`),
  createInstructor: (data) => api.post('/instructors', data),
  updateInstructor: (id, data) => api.put(`/instructors/${id}`, data),
  deleteInstructor: (id) => api.delete(`/instructors/${id}`),
};

// Category Services
export const categoryService = {
  getCategories: () => api.get('/categories'),
  getCategory: (id) => api.get(`/categories/${id}`),
  getTopCategories: () => api.get('/categories/top'),
  getCategoryCourses: (id) => api.get(`/categories/${id}/courses`),
};

// Cart Services
export const cartService = {
  addToCart: (courseId) => api.post('/cart/add', { courseId }),
  getCart: () => api.get('/cart'),
  removeFromCart: (courseId) => api.delete(`/cart/${courseId}`),
  clearCart: () => api.delete('/cart/clear'),
  updateQuantity: (courseId, quantity) => api.put(`/cart/${courseId}`, { quantity }),
};

// Order Services
export const orderService = {
  createOrder: (orderData) => api.post('/orders', orderData),
  checkout: (paymentData) => api.post('/orders/checkout', paymentData),
  getOrders: (params) => api.get('/orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  getUserOrders: () => api.get('/orders/my-orders'),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

// Dashboard Services (Admin)
export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentActivities: () => api.get('/dashboard/activities'),
  getSalesReport: (period) => api.get('/dashboard/sales', { params: { period } }),
  getPopularCourses: () => api.get('/dashboard/popular-courses'),
};

// User Services
export const userService = {
  getUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  getUserProfile: () => api.get('/users/profile'),
  updateUserProfile: (data) => api.put('/users/profile', data),
  getUserStats: (id) => api.get(`/users/${id}/stats`),
  deleteUser: (id) => api.delete(`/users/${id}`),
  toggleAdminRole: (id, isAdmin) => api.put(`/users/${id}/toggle-admin`, { isAdmin }),
  changePassword: (data) => api.put('/users/change-password', data),
};

// Review Services
export const reviewService = {
  getCourseReviews: (courseId, params) => api.get(`/courses/${courseId}/reviews`, { params }),
  createReview: (courseId, reviewData) => api.post(`/courses/${courseId}/reviews`, reviewData),
  updateReview: (reviewId, reviewData) => api.put(`/reviews/${reviewId}`, reviewData),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
};

// Enrollment Services
export const enrollmentService = {
  enrollCourse: (courseId) => api.post('/enrollments', { courseId }),
  getMyEnrollments: () => api.get('/enrollments/my-courses'),
  getEnrollmentProgress: (courseId) => api.get(`/enrollments/${courseId}/progress`),
  updateProgress: (courseId, progressData) => api.put(`/enrollments/${courseId}/progress`, progressData),
};

// Payment Services
export const paymentService = {
  processPayment: (paymentData) => api.post('/payments/process', paymentData),
  getPaymentMethods: () => api.get('/payments/methods'),
  savePaymentMethod: (methodData) => api.post('/payments/methods', methodData),
  deletePaymentMethod: (methodId) => api.delete(`/payments/methods/${methodId}`),
};

export default api;