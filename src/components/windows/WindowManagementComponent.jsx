import React, { useState, useEffect } from 'react';
import {Table, Button, Modal, Form, Input, Select, Tag} from 'antd';
import axios from 'axios';

const { Option } = Select;

const WindowManagement = () => {
    const [windows, setWindows] = useState([]);
    const [services, setServices] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentWindow, setCurrentWindow] = useState(null);
    const API_BASE_URL = 'http://127.0.0.1:8888';

    useEffect(() => {
        fetchWindows();
        fetchServices();
    }, []);

    const fetchWindows = async () => {
        const result = await axios.get(`${API_BASE_URL}/windows`);
        setWindows(result.data);
    };

    const fetchServices = async () => {
        const result = await axios.get(`${API_BASE_URL}/api/services`);
        setServices(result.data);
    };

    const handleAdd = () => {
        setCurrentWindow(null);
        setIsModalVisible(true);
    };

    const handleEdit = (window) => {
        setCurrentWindow(window);
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        await axios.delete(`${API_BASE_URL}/windows/${id}`);
        await fetchWindows();
    };

    const handleOk = async (values) => {
        if (currentWindow) {
            await axios.put(`${API_BASE_URL}/windows/${currentWindow.windowId}`, values);
        } else {
            await axios.post(`${API_BASE_URL}/windows`, values);
        }
        await fetchWindows();
        setIsModalVisible(false);
    };

    const statusMapping = {
        open: { text: '开放', color: '#2db7f5' },
        closed: { text: '关闭', color: '#f50' }
    };

    const columns = [
        { title: '窗口ID', dataIndex: 'windowId', key: 'windowId' },
        { title: '窗口名称', dataIndex: 'windowName', key: 'windowName' },
        { title: '服务名称', dataIndex: 'serviceId', key: 'serviceId', render: (serviceId) => services.find(s => s.serviceId === serviceId)?.description },
        { title: '状态', dataIndex: 'status', key: 'status', render: (status) => <Tag color={statusMapping[status].color}>{statusMapping[status].text}</Tag> },
        {
            title: '操作',
            key: 'action',
            render: (_, window) => (
                <span>
                    <Button onClick={() => handleEdit(window)}>编辑</Button>
                    <Button onClick={() => handleDelete(window.windowId)} danger>删除</Button>
                </span>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={handleAdd}>新增窗口</Button>
            <Table dataSource={windows} columns={columns} rowKey="windowId" />
            <Modal
                title={currentWindow ? '编辑窗口' : '新增窗口'}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form
                    initialValues={currentWindow}
                    onFinish={handleOk}
                >
                    <Form.Item name="windowName" label="窗口名称" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="serviceId" label="服务名称" rules={[{ required: true }]}>
                        <Select>
                            {services.map(service => (
                                <Option key={service.serviceId} value={service.serviceId}>{service.description}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="status" label="状态" rules={[{ required: true }]}>
                        <Select>
                            <Option value="open">开放</Option>
                            <Option value="closed">关闭</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default WindowManagement;
