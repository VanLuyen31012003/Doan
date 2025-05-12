import axios from 'axios';
import { getToken } from '../Lib/authenticate';
const axiosclient = axios.create(
    {
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