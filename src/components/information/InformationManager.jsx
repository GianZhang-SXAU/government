import React, { useState } from 'react';
import {Button, Card, Modal, Form, Input, message, Radio, Space, Cascader} from "antd";
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import { setUser } from '../../store/index';  // 假设 store 文件名为 store.js
import json from '../../asserts/pca.json';
import {useNavigate} from "react-router-dom";
import provinces from "../../asserts/pca.json";

const InformationManager = () => {
    const API_URL_ADMIN = "http://127.0.0.1:8888/admin";
    const user = useSelector((state) => state.user.data);
    const userType = useSelector((state) => state.user.type);

    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [docType, setDocType] = useState('idCard');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();

    const [form] = Form.useForm();

    const regionData = json; // JSON数据接口赋值

    const onDocTypeChange = (e) => {
        setDocType(e.target.value);
        form.resetFields(['idCard']);
    };

    // 将数据转化为Ant Design Cascader 组件可用的数据格式
    const options = Object.keys(regionData).entries(provinces).map(([province, districts]) => ({
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

    // 身份证号校验
    const UservalidateIdCard = (rule, value) => {
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

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        form.validateFields().then(values => {

            if (Array.isArray(values.atlocal)) {
                const [province, district, city] = values.atlocal;
                values.province = province;
                values.district = district;
                values.city = city;
                values.atlocal = null;
            }

            // 根据用户类型设置请求URL
            const url = userType === 'user'
                ? `#`  // 普通用户的请求URL
                : `${API_URL_ADMIN}/profile`; // 管理员的请求URL

            axios.put(url, values)
                .then(response => {
                    message.success('用户信息更新成功');
                    dispatch(setUser({ data: values, type: userType }));
                    setIsModalVisible(false);
                })
                .catch(error => {
                    message.error('更新失败，请稍后重试');
                });
        }).catch(info => {
            console.log('Validate Failed:', info);
        });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    if (!user) {
        return <div>未登录</div>;
    }

    return (
        <>
            <Card title={userType === 'user' ? "用户信息" : "管理员信息"}
                  extra={
                      <Button type="primary" onClick={showModal}>
                          修改个人信息
                      </Button>
                  }>
                <p><strong>用户名:</strong> {user.name || user.username}</p>
                <p><strong>电话:</strong> {user.phone}</p>
                {userType === 'user' && (
                    <>
                        <p><strong>身份证号:</strong> {user.idcard}</p>
                        <p><strong>所在地区:</strong> {user.location}</p>
                        <p><strong>县:</strong> {user.city}</p>
                        <p><strong>市:</strong> {user.district}</p>
                        <p><strong>省:</strong> {user.province}</p>
                        <p><strong>工作单位:</strong> {user.work}</p>
                        <p><strong>身份:</strong> {user.profession}</p>
                    </>
                )}
                {userType === 'admin' && (
                    <>
                        <p><strong>邮箱:</strong> {user.email}</p>
                    </>
                )}
            </Card>

            <Modal title="修改个人信息"
                   visible={isModalVisible}
                   onOk={handleOk}
                   onCancel={handleCancel}
            >
                <Form form={form} layout="vertical" initialValues={user}>
                    <Form.Item label="用户名" name="username">
                        <Input />
                    </Form.Item>
                    <Form.Item label="电话" name="phone">
                        <Input />
                    </Form.Item>
                    {userType === 'user' && (
                        <>
                            <Form.Item
                                name="name"
                                label="用户姓名"
                                rules={[{ required: true, message: '请输入用户姓名!' }]}
                            >
                                <Input placeholder="请输入用户姓名" />
                            </Form.Item>
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
                                        { validator: UservalidateIdCard },
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
                    {userType === 'admin' && (
                        <Form.Item label="邮箱" name="email">
                            <Input />
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </>
    );
};

export default InformationManager;
