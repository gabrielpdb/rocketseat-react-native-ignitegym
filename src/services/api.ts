import axios from "axios"

const api = axios.create({
  baseURL: "http://10.0.0.101:3333",
})

api.interceptors.response.use(
  (response) => {
    console.log("INTERCEPTOR => ", response)

    return response
  },
  (error) => {
    console.log("INTERCEPTOR => ", error)
    return Promise.reject(error)
  }
)

export { api }
