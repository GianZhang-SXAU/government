// 作者: 张建安
// 代码用途: 该组件实现了一个带有验证码功能的输入框，用户可以输入验证码并进行验证，验证通过后触发相应的回调函数。

import React, { useState, useEffect } from 'react';
import { Input, message } from 'antd'; // 引入 Ant Design 的输入框和消息提示组件
import axios from 'axios'; // 用于发送 HTTP 请求

// CaptchaInput 组件，接收一个回调函数 onVerify，用于处理验证码验证结果
const CaptchaInput = ({ onVerify }) => {
    const [uuid, setUuid] = useState(''); // 用于存储每次生成的验证码 UUID
    const [captchaUrl, setCaptchaUrl] = useState(''); // 用于存储验证码图片的 URL
    const [captchaInput, setCaptchaInput] = useState(''); // 用于存储用户输入的验证码

    // 生成新的验证码 UUID 并更新验证码图片 URL
    const generateCaptcha = () => {
        const newUuid = Math.random().toString(36).substring(2, 15); // 生成随机 UUID
        setUuid(newUuid); // 更新 UUID 状态
        setCaptchaUrl(`http://127.0.0.1:8888/captcha?uuid=${newUuid}`); // 设置验证码图片 URL
    };

    // 组件挂载时自动生成验证码
    useEffect(() => {
        generateCaptcha();
    }, []);

    // 处理验证码验证逻辑
    const handleVerify = async () => {
        try {
            // 发送请求验证验证码
            const response = await axios.get('http://127.0.0.1:8888/verifyCaptcha', {
                params: {
                    uuid,
                    code: captchaInput
                }
            });
            // 根据返回结果判断验证码是否验证成功
            if (response.data) {
                message.success('验证码验证成功'); // 显示成功消息
                onVerify(true); // 调用回调函数，传递验证成功的结果
            } else {
                message.error('验证码验证失败'); // 显示失败消息
                onVerify(false); // 调用回调函数，传递验证失败的结果
                generateCaptcha(); // 生成新的验证码
            }
        } catch (error) {
            message.error('验证验证码时出错'); // 捕获异常并显示错误消息
            generateCaptcha(); // 生成新的验证码
        }
    };

    return (
        <div>
            <div style={{ marginTop: '10px' }}>
                验证码：
                {/* 验证码输入框 */}
                <Input
                    placeholder="请输入验证码"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)} // 更新用户输入的验证码
                    onBlur={handleVerify} // 当输入框失去焦点时验证验证码
                    style={{ width: '150px', marginRight: '10px' }}
                />
                {/* 验证码图片，点击图片可以刷新验证码 */}
                {captchaUrl && (
                    <img
                        src={captchaUrl}
                        alt="验证码加载失败"
                        onClick={generateCaptcha} // 点击图片生成新的验证码
                        style={{ cursor: 'pointer', width: "100px", height: "50px" }}
                    />
                )}
            </div>
        </div>
    );
};

export default CaptchaInput;
