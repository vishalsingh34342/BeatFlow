import axios from "axios";

const api = axios.create({
  baseURL: "https://beatflow-kdkv.onrender.com/api",
  withCredentials: true,
});

export default api;
