/**
 * Here we have our interceptor. 
 * The concept is to write something that will help us
 * to "intercept" all the requests and add the required
 * headers, avoiding to repeat this everywhere a request 
 * is made in the frontend
 * 
 * Axios is the library used to set network requests
 */

import axios from "axios"
import { ACCESS_TOKEN } from "./constants"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token){
            config.headers = {...config.headers, Authorization: `Bearer ${token}`}
        }
        return config;
    },
    // TODO: I have to read about async JS
    (error) => {
        return Promise.reject(error);
    }
)

export default api;
