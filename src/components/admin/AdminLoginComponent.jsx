import React, { useState, useEffect } from 'react';
import { Input, Button, Form, message, Layout, Menu } from 'antd';
import axios from 'axios';

import CaptchaInput from '../CaptchaInput';
const { Header } = Layout;

const AdminLoginComponent = () => {
    const [captchaVerified, setCaptchaVerified] = useState(false);
    const [userInfo, setUserInfo] = useState(null);


    const handleCaptchaVerified = (verified) => {
        setCaptchaVerified(verified);
    };

    const handleLogin = async (values) => {
        try {
            const response = await axios.post('http://localhost:8888/admin/login', values);
            if (response.data.success) {
                const { username, ...rest } = response.data;
                localStorage.setItem('userInfo', JSON.stringify(rest));
                setUserInfo(rest);
                message.success(`欢迎${username}`);

            } else {
                message.error('登录失败');
            }
        } catch (error) {
            message.error('登录时出错');
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.removeItem('userInfo');
            setUserInfo(null);
            message.warning('由于30分钟未操作，已退出登录');

        }, 1800000); // 30分钟未操作退出登录

        return () => clearTimeout(timer);
    }, [userInfo]);

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUserInfo(null);
        message.success('已退出登录');

    };

    return (
        <Layout className="layout">
            <Header>
                <div className="logo" />
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                    {userInfo && (
                        <Menu.Item key="1" onClick={logout}>
                            欢迎{userInfo.username}
                        </Menu.Item>
                    )}
                </Menu>
            </Header>
            <div style={{ padding: '50px' }}>
                <Form onFinish={handleLogin} style={{ maxWidth: '400px', margin: 'auto' }}>
                    <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
                        <Input placeholder="用户名" />
                    </Form.Item>
                    <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
                        <Input.Password placeholder="密码" />
                    </Form.Item>
                    <CaptchaInput onVerify={handleCaptchaVerified} />
                    <Form.Item>
                        <Button type="primary" htmlType="submit" disabled={!captchaVerified}>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Layout>
    );
};

export default AdminLoginComponent;
