import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import CaptchaInput from '../CaptchaInput'; // 假设 CaptchaInput 文件在同一目录下

const AdminRegisterComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [captchaVerified, setCaptchaVerified] = useState(false);

    const API_URL = `http://127.0.0.1:8888`;

    const handleSubmit = async () => {
        if (!captchaVerified) {
            message.error("请先验证验证码");
            return;
        }
        try {
            await axios.post(`${API_URL}/admin/register`, { username, password, email, phone });
            message.success("注册成功，请返回继续登录");
        } catch (error) {
            console.error('Registration failed:', error);
            message.error("注册失败，请稍后再试");
        }
    };

    return (
        <div>
            欢迎来到注册界面
            <Form onFinish={handleSubmit}>
                <Form.Item
                    label="用户名"
                    rules={[{ required: true, message: '请输入用户名' }]}
                >
                    <Input value={username} onChange={(e) => setUsername(e.target.value)} />
                </Form.Item>
                <Form.Item
                    label="密码"
                    rules={[{ required: true, message: '请输入密码' }]}
                >
                    <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Item>
                <Form.Item
                    label="邮箱"
                    rules={[
                        { required: true, message: '请输入邮箱' },
                        { type: 'email', message: '请输入有效的邮箱地址' }
                    ]}
                >
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                </Form.Item>
                <Form.Item
                    label="电话号"
                    rules={[
                        { required: true, message: '请输入手机号' },
                        { pattern: /^[1-9]\d{10}$/, message: '请输入有效的手机号' }
                    ]}
                >
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                </Form.Item>
                <Form.Item>
                    <CaptchaInput onVerify={setCaptchaVerified} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" disabled={!captchaVerified}>Register</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AdminRegisterComponent;
