import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

const AdminRegisterComponent = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = (values) => {
        setLoading(true);
        axios.post('/admin/register', values)
            .then(response => {
                message.success(response.data);
            })
            .catch(error => {
                message.error('Register failed');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Form name="register" onFinish={onFinish}>
            <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
                <Input placeholder="Username" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item name="email" rules={[{ type: 'email', message: 'The input is not valid E-mail!' }]}>
                <Input placeholder="Email" />
            </Form.Item>
            <Form.Item name="phone">
                <Input placeholder="Phone" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Register
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AdminRegisterComponent;

