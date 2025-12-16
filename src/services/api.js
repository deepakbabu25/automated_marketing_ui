import privateApiClient from './privateApiClient';
import publicApi from './publicApiClient';

privateApiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("user_token");
        console.log("Token---", token)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)

);


export const api = {
    testApi: async () => {
        const response = await axiosInstance.get('/testing_get')
        return response.data
    },
    checkCredibilityScore: async (payload) => {
        const response = await publicApi.post('/info', payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },
    register: async (payload) => {
        try {
            const response = await publicApi.post('/create_org', payload)
            return {
                success: true,
                status: response.status,
                data: response.data,
            };
        } catch (error) {
            // NETWORK ERROR (no response)
            if (!error.response) {
                return {
                    success: false,
                    status: null,
                    error: "Network error. Please check your connection.",
                };
            }

            // BACKEND RESPONDED WITH ERROR
            return {
                success: false,
                status: error.response.status,
                error: error.response.data,
            };
        }

    },
    login: async (payload) => {
        const response = await publicApi.post("/login_org", payload);
        return response.data;
    },
    getProductsData: async () => {
        const response = await privateApiClient.get("/products");
        return response.data;

    },
    getProductDetails: async (id) => {
        const response = await privateApiClient.get(`/products/${id}/`);
        return response.data;
    },
    deleteProduct: async (id) => {
        const response = await privateApiClient.delete(`/products/${id}/`);
        return response.data;
    },
}