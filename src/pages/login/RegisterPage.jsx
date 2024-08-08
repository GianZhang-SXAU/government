import React, { useState } from 'react';
import {Form, Input, Button, Select, message, Card, ConfigProvider, Cascader, Radio, Space} from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import provinces from '../../asserts/pca.json'

const { Option } = Select;

const RegisterPage = () => {
    const [type, setType] = useState('user');
    const [loading, setLoading] = useState(false);
    const [docType, setDocType] = useState('idCard');
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const API_URL = "http://127.0.0.1:8888"; // 后端 API 的基础 URL

    const onDocTypeChange = (e) => {
        setDocType(e.target.value);
        form.resetFields(['idCard']);
    };

    // 将数据转化为Ant Design Cascader 组件可用的数据格式
    const options = Object.entries(provinces).map(([province, districts]) => ({
        value: province,
        label: province,
        children: Object.entries(districts).map(([district, cities]) => ({
            value: district,
            label: district,
            children: cities.map(city => ({
                value: city,
                label: city
            }))
        }))
    }));

    // 用户类型选择后触发
    const handleUserTypeChange = (e) => {
        setType(e.target.value);
        form.resetFields(["user"])
    };

    // 表单提交成功时的处理函数
    const onFinish = async (values) => {
        setLoading(true);

        // 假设 atlocal 返回的是一个数组，例如 ['北京市', '市辖区', '东城区']
        if (Array.isArray(values.atlocal)) {
            const [province, district, city] = values.atlocal;
            values.province = province;
            values.district = district;
            values.city = city;
            values.atlocal = null;
        }

        try {
            const response = await axios.post(`${API_URL}/api/auth/register`, { ...values, type: type });
            if (response.data.success) {
                message.success('注册成功！');
                navigate('/login'); // 注册成功后跳转到登录页面
            } else {
                message.error('注册失败，请重试！');
            }
        } catch (error) {
            message.error('注册失败，请重试！');
        }
        setLoading(false);
    };

    // 身份证号校验
    const validateIdCard = (rule, value) => {
        const idCardRegex = /^[1-9]\d{5}(18|19|20)?\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])\d{3}(\d|X)$/i;
        if (!value || idCardRegex.test(value)) {
            return Promise.resolve();
        }
        return Promise.reject('请输入有效的中国大陆身份证号码');
    };

    // 护照校验
    const validatePassport = (rule, value) => {
        const passportRegex = /^[a-zA-Z0-9]{5,17}$/;
        if (!value || passportRegex.test(value)) {
            return Promise.resolve();
        }
        return Promise.reject('请输入有效的护照号码');
    };

    // 密码校验
    const validatePassword = (rule, value) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
        if (!value || passwordRegex.test(value)) {
            return Promise.resolve();
        }
        return Promise.reject('密码必须包含大小写字母和数字，长度至少为6位');
    };

    return (
        <ConfigProvider>
            <Card title="注册" className="register-card">
                <Form name="register" onFinish={onFinish} className="registerform">
                    <Form.Item
                        name="type"
                        label="用户类型"
                        rules={[{ required: true, message: '请选择用户类型!' }]}
                    >
                        <Radio.Group onChange={handleUserTypeChange} value={type} defaultValue="user">
                            <Space size="large" >
                                <Radio value="user">用户</Radio>
                                <Radio value="admin">管理员</Radio>
                            </Space>
                        </Radio.Group>
                    </Form.Item>
                    {type === "user" && (
                        <>
                            <Form.Item
                                name="name"
                                label="用户姓名"
                                rules={[{ required: true, message: '请输入用户姓名!' }]}
                            >
                                <Input placeholder="请输入用户姓名" />
                            </Form.Item>
                        </>
                    )}
                    {type === "admin" && (
                        <>
                            <Form.Item
                                name="username"
                                label="管理员账号"
                                rules={[{ required: true, message: '请输入管理员账号!' }]}
                            >
                                <Input placeholder="请输入管理员账号" />
                            </Form.Item>
                        </>
                    )}
                    <Form.Item
                        name="password"
                        label="密码"
                        rules={[{ required: true, message: '请输入密码!' }, { validator: validatePassword }]}
                    >
                        <Input.Password placeholder="密码" />
                    </Form.Item>
                    <Form.Item name="phone" label="电话号" rules={[{ required: true, message: '请输入电话号!' }]}>
                        <Input placeholder="电话号" />
                    </Form.Item>


                    {type === 'user' && (
                        <>
                            <Form.Item label="证件类型" name="docType">
                                <Radio.Group onChange={onDocTypeChange} value={docType} defaultValue="idCard">
                                    <Space size="large">
                                        <Radio value="idCard">中国居民身份证</Radio>
                                        <Radio value="passport">护照</Radio>
                                    </Space>
                                </Radio.Group>
                            </Form.Item>

                            {docType === 'idCard' && (
                                <Form.Item
                                    name="idCard"
                                    label="身份证号码"
                                    rules={[
                                        { required: true, message: '请输入身份证号码' },
                                        { validator: validateIdCard },
                                    ]}
                                >
                                    <Input placeholder="请输入身份证号码" />
                                </Form.Item>
                            )}

                            {docType === 'passport' && (
                                <Form.Item
                                    name="idCard"
                                    label="护照号码"
                                    rules={[
                                        { required: true, message: '请输入护照号码' },
                                        { validator: validatePassport },
                                    ]}
                                >
                                    <Input placeholder="请输入护照号码" />
                                </Form.Item>
                            )}

                            <Form.Item
                                name="atlocal"
                                label="所在地区"
                                rules={[{ required: true, message: '请选择所在地区!' }]}
                            >
                                <Cascader options={options}  placeholder="请选择所在地区" />
                            </Form.Item>
                            <Form.Item
                                name="location"
                                label="详细地址"
                                rules={[{ required: true, message: '请选择所在地区!' }]}
                            >
                                <Input></Input>
                            </Form.Item>
                            <Form.Item name="work" label="工作单位">
                                <Input placeholder="工作单位" />
                            </Form.Item>
                            <Form.Item name="profession" label="身份">
                                <Input placeholder="身份" />
                            </Form.Item>
                        </>
                    )}

                    {type === 'admin' &&(
                        <>
                            <Form.Item
                                name="email"
                                label="电子邮箱"
                                rules={[
                                    {
                                        type: 'email',
                                        message: '请输入一个正确的邮箱号!',
                                    },
                                    {
                                        required: true,
                                        message: '请输入您的邮箱号!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </>
                    )}

                    <Form.Item style={{ textAlign: "center" }}>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            注册
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </ConfigProvider>
    );
};

export default RegisterPage;
