import axios from "axios"

export const baseURL = 'http://localhost:3000/api'

export const apiClient = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // store JWT at login
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// optional: global response handler for 401 -> redirect
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default apiClient;