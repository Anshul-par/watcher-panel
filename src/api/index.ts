import axios from "axios";

const BASE_URL = "http://172.168.16.12:5000";

const customAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 50000,
  headers: { Authorization: "" },
});

export default customAxios;
