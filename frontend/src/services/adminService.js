import axios from 'axios';

const API_BASE_URL = 'https://healthcare-mvsv.onrender.com';

// Create axios instance with default config
const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['x-access-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
);

// Admin API functions
export const adminService = {
  // Get all patients
  getUsers: () => adminApi.get('/admin/get-users'),
  
  // Delete user
  deleteUser: (userId) => adminApi.delete(`/admin/delete-user/${userId}`),
  
  // Get contacts
  getContacts: () => adminApi.get('/admin/get-contacts'),
  
  // Add department
  addDepartment: (departmentData) => adminApi.post('/admin/add-department', departmentData),
  
  // Delete department
  deleteDepartment: (departmentId) => adminApi.delete(`/admin/delete-department/${departmentId}`),
  
  // Get departments
  getDepartments: () => adminApi.get('/admin/get-department'),
  
  // Get counts
  getCounts: () => adminApi.get('/admin/get-count'),
  
  // Add newsletter
  addNewsletter: (email) => adminApi.post('/admin/new-letter', { email }),
  
  // Get newsletters
  getNewsletters: () => adminApi.get('/admin/get-sent-newsletter'),
};

export default adminService;
