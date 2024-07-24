import React, { useEffect, useState } from 'react';
import { Button, Input, Space } from 'antd';
import { generateCaptcha } from '../utils/captcha';

const Captcha = ({ onChange }) => {
    const [captcha, setCaptcha] = useState({});
    const [captchaInput, setCaptchaInput] = useState('');

    useEffect(() => {
        refreshCaptcha();
    }, []);

    const refreshCaptcha = () => {
        const newCaptcha = generateCaptcha();
        setCaptcha(newCaptcha);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setCaptchaInput(value);
        if (onChange) {
            onChange(value);
        }
    };

    return (
        <Space>
            <Input value={captchaInput} onChange={handleInputChange} />
            <div dangerouslySetInnerHTML={{ __html: captcha.data }} />
            <Button onClick={refreshCaptcha}>刷新验证码</Button>
        </Space>
    );
};

export default Captcha;
