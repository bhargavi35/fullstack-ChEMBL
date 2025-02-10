import axios from "axios";

const API_URL = "http://localhost:5000";

// Fetch compounds list (for search)
export const fetchCompounds = async (filters) => {
    const response = await axios.get(`${API_URL}/compounds`, { params: filters });
    return response.data;
};

// ✅ Fetch detailed information for a specific compound
export const fetchCompoundDetails = async (chemblId) => {
    const response = await axios.get(`${API_URL}/compounds/${chemblId}`);
    return response.data;
};
