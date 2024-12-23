import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL as string;

const customAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 50000,
  headers: { Authorization: localStorage.getItem("token") || "" },
});

export default customAxios;
