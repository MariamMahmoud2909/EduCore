import axios from 'axios';

const API_BASE_URL = 'https://localhost:5149/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
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
  getSimilarCourses: (id) => api.get(`/courses/${id}/similar`),
  createCourse: (data) => api.post('/courses', data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
};

// Instructor Services
export const instructorService = {
  getInstructors: (params) => api.get('/instructors', { params }),
  getInstructor: (id) => api.get(`/instructors/${id}`),
  getTopInstructors: () => api.get('/instructors/top'),
  createInstructor: (data) => api.post('/instructors', data),
  updateInstructor: (id, data) => api.put(`/instructors/${id}`, data),
  deleteInstructor: (id) => api.delete(`/instructors/${id}`),
};

// Category Services
export const categoryService = {
  getCategories: () => api.get('/categories'),
  getTopCategories: () => api.get('/categories/top'),
};

// Cart Services
export const cartService = {
  addToCart: (courseId) => api.post('/cart', { courseId }),
  getCart: () => api.get('/cart'),
  removeFromCart: (courseId) => api.delete(`/cart/${courseId}`),
  clearCart: () => api.delete('/cart'),
};

// Order Services
export const orderService = {
  checkout: (paymentData) => api.post('/orders/checkout', paymentData),
  getOrders: () => api.get('/orders'),
};

// Dashboard Services
export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
};

// User Services
export const userService = {
  getUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  getUserStats: (id) => api.get(`/users/${id}/stats`),
  deleteUser: (id) => api.delete(`/users/${id}`),
  toggleAdminRole: (id, isAdmin) => api.put(`/users/${id}/toggle-admin`, { isAdmin }),
};
export default api;