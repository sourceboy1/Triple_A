import axios from "axios";

// api.js
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://tripleastechng.com/api",
});


export default api;
