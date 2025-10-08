// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'LE'
  }).format(amount);
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format date time
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Truncate text
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get level badge color
export const getLevelBadgeColor = (level) => {
  switch(level) {
    case 1: return 'success';
    case 2: return 'warning';
    case 3: return 'danger';
    default: return 'secondary';
  }
};

// Get level name
export const getLevelName = (level) => {
  switch(level) {
    case 1: return 'Beginner';
    case 2: return 'Intermediate';
    case 3: return 'Advanced';
    default: return 'Unknown';
  }
};

// Get job title name
export const getJobTitleName = (jobTitle) => {
  const titles = {
    1: 'Fullstack Developer',
    2: 'Backend Developer',
    3: 'Frontend Developer',
    4: 'UX/UI Designer',
    5: 'AI Engineer'
  };
  return titles[jobTitle] || 'Instructor';
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password
export const isValidPassword = (password) => {
  return password.length >= 6;
};

// Calculate cart total
export const calculateCartTotal = (cart) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.15;
  return {
    subtotal,
    tax,
    total: subtotal + tax
  };
};

// Generate random avatar
export const generateAvatar = (name) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=1E3A8A&color=fff`;
};

// Check if user can edit course
export const canEditCourse = (course) => {
  return !course.isPurchased;
};

// Check if instructor can be deleted
export const canDeleteInstructor = (instructor) => {
  return !instructor.coursesCount || instructor.coursesCount === 0;
};

export default {
  formatCurrency,
  formatDate,
  formatDateTime,
  truncateText,
  getLevelBadgeColor,
  getLevelName,
  getJobTitleName,
  isValidEmail,
  isValidPassword,
  calculateCartTotal,
  generateAvatar,
  canEditCourse,
  canDeleteInstructor
};