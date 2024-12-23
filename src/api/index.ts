import axios from "axios";

const BASE_URL = "http://116.72.16.128:3217"

const customAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 50000,
  headers: { Authorization: localStorage.getItem("token") || "" },
});

export default customAxios;
