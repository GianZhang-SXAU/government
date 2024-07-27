import React, { useState, useEffect } from 'react';
import { Input, message } from 'antd';
import axios from 'axios';

const CaptchaInput = ({ onVerify }) => {
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
                onVerify(true);
            } else {
                message.error('验证码验证失败');
                onVerify(false);
                generateCaptcha();
            }
        } catch (error) {
            message.error('验证验证码时出错');
            generateCaptcha();
        }
    };

    return (
        <div>
            <div style={{ marginTop: '10px' }}>
                验证码：
                <Input
                    placeholder="请输入验证码"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    onBlur={handleVerify}
                    style={{ width: '150px', marginRight: '10px' }}
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
