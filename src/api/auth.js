import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8888';

const login = (data) => {
    return axios.post(`${API_BASE_URL}/login`, data,{
        headers:{
            'Accept': 'application/json',
        }
    });
};

const register = (data) => {
    return axios.post(`${API_BASE_URL}/register`, data,{
        headers:{
            'Accept': 'application/json',
        }
    })
}

export default {
    login,
    register
};