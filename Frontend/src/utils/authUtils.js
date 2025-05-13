import axios from 'axios';

export const loginUser = async (email, password) => {
    const loginData = { email, password };

    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/login`, loginData);
        if (response.status === 200) {
            return { success: true, data: response.data };
        } else {
            return { success: false, error: 'Unexpected response' };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error };
    }
};

export const registerUser = async (username, email, password) => {
    const registerData = { username, email, password };

    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/register`, registerData);
        if (response.status === 200) {
            return { success: true, data: response.data };
        } else {
            return { success: false, error: 'Unexpected response' };
        }
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, error };
    }
};