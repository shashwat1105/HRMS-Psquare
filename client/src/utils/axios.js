// src/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000', // <-- use your backend URL
  withCredentials: true,
});

export default instance;
