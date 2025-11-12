import axios from "axios"

export const baseURL = 'http://localhost:3000/api'

export const apiClient = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
})