import React, { useState, useEffect } from 'react';
import {Table, Button, Form, Input, Modal, Select, message, Popconfirm, Space} from 'antd';
import axios from 'axios';

const { Option } = Select;

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/users');
            setUsers(response.data);
        } catch (error) {
            message.error('Failed to fetch users');
        }
        setLoading(false);
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        form.setFieldsValue(user);
        setIsModalVisible(true);
    };

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`/api/users/${userId}`);
            message.success('User deleted successfully');
            fetchUsers();
        } catch (error) {
            message.error('Failed to delete user');
        }
    };

    const handleFinish = async (values) => {
        try {
            if (editingUser) {
                await axios.put(`/api/users/${editingUser.userId}`, values);
                message.success('User updated successfully');
            } else {
                await axios.post('/api/users', values);
                message.success('User added successfully');
            }
            setIsModalVisible(false);
            fetchUsers();
        } catch (error) {
            message.error('Failed to save user');
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '电话号',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '身份证号',
            dataIndex: 'idcard',
            key: 'idcard',
        },
        {
            title: '所在地区',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: '县',
            dataIndex: 'city',
            key: 'city',
        },
        {
            title: '市',
            dataIndex: 'district',
            key: 'district',
        },
        {
            title: '省',
            dataIndex: 'province',
            key: 'province',
        },
        {
            title: '工作单位',
            dataIndex: 'work',
            key: 'work',
        },
        {
            title: '身份',
            dataIndex: 'profession',
            key: 'profession',
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <>
                    <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
                    <Popconfirm
                        title="确定删除该用户吗？"
                        onConfirm={() => handleDelete(record.userId)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button type="link">删除</Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }}>
                添加用户
            </Button>
            <Table
                columns={columns}
                dataSource={users}
                rowKey="userId"
                loading={loading}
            />
            <Modal
                title={editingUser ? "编辑用户" : "添加用户"}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form form={form} onFinish={handleFinish}>
                    <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="电话号" rules={[{ required: true, message: '请输入电话号' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="idcard" label="身份证号" rules={[{ required: true, message: '请输入身份证号' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="location" label="所在地区">
                        <Input />
                    </Form.Item>
                    <Form.Item name="city" label="县">
                        <Input />
                    </Form.Item>
                    <Form.Item name="district" label="市">
                        <Input />
                    </Form.Item>
                    <Form.Item name="province" label="省">
                        <Input />
                    </Form.Item>
                    <Form.Item name="work" label="工作单位">
                        <Input />
                    </Form.Item>
                    <Form.Item name="profession" label="身份">
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                保存
                            </Button>
                            <Button onClick={handleCancel}>
                                取消
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ManageUsers;
