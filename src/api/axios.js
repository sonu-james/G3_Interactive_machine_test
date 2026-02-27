import axios from "axios";

const api = axios.create({
    baseURL: "http://13.210.33.250/api",
});

api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    config.headers.company_id = localStorage.getItem("company_id");
    config.headers.Accept = "application/json";
    return config;
});

export default api;