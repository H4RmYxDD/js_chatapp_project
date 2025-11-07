import axios from "axios"

export const baseURL = 'http://localhost:'

export const apiClient = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
})