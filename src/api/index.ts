import axios from "axios"

const BASE_URL = "http://localhost:5001"

const customAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 50000,
  headers: { Authorization: localStorage.getItem("token") || "" },
})

export default customAxios
