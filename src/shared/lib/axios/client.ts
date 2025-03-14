import axios from "axios"

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

client.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("token")
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => Promise.reject(error),
)

client.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error.response),
)
