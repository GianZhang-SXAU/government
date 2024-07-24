import axios from 'axios';

const FORM_API = '127.0.0.1:8888/submit';

export const submitFormData = async (formData) => {
    try {
        const response = await axios.post(FORM_API, formData);
        return response.data;
    } catch (error) {
        console.error('Error submitting form:', error);
        throw error;  // 重新抛出错误以便在组件中处理
    }
};