import axios from 'axios';
import { getToken } from '../lib/authenticate';
const axiosclient = axios.create(
    {
        // baseURL:'http://192.168.65.66:8080/',
                 baseURL:'http://localhost:8080/',
        headers:{
            'Content-Type': 'application/json'
        }
    }
)
axiosclient.interceptors.request.use(
    config => {
        const token = getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)

)
export default axiosclient;