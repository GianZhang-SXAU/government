import React, { useState } from 'react';
import {Form, Input, Button, message, Card, ConfigProvider} from 'antd';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/index';
import { useNavigate } from 'react-router-dom';
import Login, {Banner} from "@react-login-page/page3";

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();



    const API_URL = "http://localhost:8888";

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, values);
            const data = response.data;
            if (data) {
                const { type, user, admin } = data;
                const userData = type === 'user' ? user : admin;
                dispatch(setUser({ data: userData, type }));
                message.success('登录成功！');
                if (type === 'user') {
                    navigate('/user');
                } else if (type === 'admin') {
                    navigate('/reserve');
                }
            } else {
                message.error('登录失败，请检查用户名或密码');
            }
        } catch (error) {
            message.error('登录失败，请检查用户名或密码');
        }
        setLoading(false);
    };

    return (
        <>
            政务服务大厅预约与排队系统
        <h1>登录</h1>
            <ConfigProvider
                theme={{
                    token: {
                        lineWidth: 2,
                    },
                }}
            >
            <Card title="登录">
        <Form name="login" onFinish={onFinish}>
            <Form.Item name="username" rules={[{ required: true, message: '请输入用户名!' }]}>
                <Input placeholder="用户名" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: '请输入密码!' }]}>
                <Input.Password placeholder="密码" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    登录
                </Button>
            </Form.Item>
        </Form>
            </Card>
            </ConfigProvider>
        </>
    );
};

export default LoginPage;
