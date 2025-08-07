import axios from "axios";

const API = axios.create({
  baseURL: "https://linkedin-platform.onrender.com/api",
  withCredentials: true,
});

export default API;
