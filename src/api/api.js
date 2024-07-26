import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8888';

// 验证码
const vcode = () => {
    return axios.get(`${API_BASE_URL}/code`);
}
export default {
   vcode
};