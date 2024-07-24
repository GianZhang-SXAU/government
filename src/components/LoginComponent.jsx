import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, IdcardOutlined, CompassOutlined} from '@ant-design/icons';
import {Link, useNavigate} from 'react-router-dom'; // 导入useNavigate
import auth from '../api/auth';

const LoginComponent = () => {
    const navigate = useNavigate(); // 使用useNavigate hook

    const onFinish = (values) => {
        // 登录逻辑
        auth.login(values)
            .then(response => {
                message.success('登录成功');
                navigate('/index'); // 登录成功后跳转到/index
            })
            .catch(error => {
                message.error('登录失败，请检查手机号或身份证号');
            });
    };

    return (
        <Form
            name="login_form"
            onFinish={onFinish}
            initialValues={{ remember: true }}
            style={{ maxWidth: 300, margin: 'auto', padding: '50px 0' }}
        >
            <Form.Item
                name="phone"
                rules={[{ required: true, message: '请输入手机号' }]}
            >
                <Input prefix={<UserOutlined />} placeholder="手机号" />
            </Form.Item>
            <Form.Item
                name="idCard"
                rules={[{ required: true, message: '请输入身份证号' }]}
            >
                <Input prefix={<IdcardOutlined />} placeholder="身份证号" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
            >
                <Input prefix={<CompassOutlined />} placeholder="密码" />
            </Form.Item>
            <Link to="/register" target="_blank">
                没有账号?马上注册！
            </Link>
            <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                    登录
                </Button>
            </Form.Item>
        </Form>
    );
};

export default LoginComponent;
