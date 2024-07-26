import React, { useState, useEffect } from 'react';
import { Input, message } from 'antd';
import axios from 'axios';

const CaptchaInput = () => {
    const [uuid, setUuid] = useState('');
    const [captchaUrl, setCaptchaUrl] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');

    const generateCaptcha = () => {
        const newUuid = Math.random().toString(36).substring(2, 15);
        setUuid(newUuid);
        setCaptchaUrl(`http://127.0.0.1:8888/captcha?uuid=${newUuid}`);
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    const handleVerify = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8888/verifyCaptcha', {
                params: {
                    uuid,
                    code: captchaInput
                }
            });
            if (response.data) {
                message.success('验证码验证成功');
                // generateCaptcha(); // 验证成功后生成新的验证码
                // setCaptchaInput(''); // 清空输入框
            } else {
                message.error('验证码验证失败');
                // generateCaptcha(); // 验证失败后刷新验证码
            }
        } catch (error) {
            message.error('验证验证码时出错');
            generateCaptcha(); // 出错时刷新验证码
        }
    };

    return (
        <div>
            <div style={{ marginTop: '10px' }}>
                <Input
                    placeholder="请输入验证码"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    onBlur={handleVerify} // 失去焦点时验证验证码
                    style={{ width: '200px', marginRight: '10px' }}
                />
                {captchaUrl && (
                    <img
                        src={captchaUrl}
                        alt="验证码加载失败"
                        onClick={generateCaptcha}
                        style={{ cursor: 'pointer', width: "100px", height: "50px" }}
                    />
                )}
            </div>
        </div>
    );
};

export default CaptchaInput;
