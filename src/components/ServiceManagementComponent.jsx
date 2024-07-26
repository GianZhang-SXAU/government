import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import axios from 'axios';

const ServiceManagement = () => {
    const API_BASE_URL = 'http://127.0.0.1:8888';
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentService, setCurrentService] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/services`);
            console.log(response.data);
            setServices(response.data);
        } catch (error) {
            message.error('连结服务器失败');
        }
        setLoading(false);
    };

    const handleAdd = () => {
        setCurrentService(null);
        setModalVisible(true);
    };

    const handleEdit = (record) => {
        setCurrentService(record);
        setModalVisible(true);
        form.setFieldsValue(record);
    };

    const handleDelete = async (serviceId) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/services/${serviceId}`);
            message.success('Service deleted successfully');
            fetchServices();
        } catch (error) {
            message.error('Failed to delete service');
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (currentService) {
                await axios.put(`${API_BASE_URL}/api/services/${currentService.serviceId}`, values);
                message.success('Service updated successfully');
            } else {
                // eslint-disable-next-line no-template-curly-in-string
                await axios.post(`${API_BASE_URL}/api/services`, values);
                message.success('Service added successfully');
            }
            fetchServices();
            setModalVisible(false);
            form.resetFields();
        } catch (error) {
            message.error('Failed to save service');
        }
    };

    const columns = [
        {
            title: '服务ID',
            dataIndex: 'serviceId',
            key: 'serviceId',
        },
        {
            title: '服务名',
            dataIndex: 'serviceName',
            key: 'serviceName',
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
          <Button onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>
            编辑
          </Button>
          <Button onClick={() => handleDelete(record.serviceId)} danger>
            删除
          </Button>
        </span>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
                添加服务
            </Button>
            <Table columns={columns} dataSource={services} rowKey="serviceId" loading={loading} />
            <Modal
                title={currentService ? '编辑服务' : '添加服务'}
                visible={modalVisible}
                onOk={handleOk}
                onCancel={() => setModalVisible(false)}
            >
                <Form form={form} layout="vertical" initialValues={currentService}>
                    <Form.Item
                        name="serviceName"
                        label="服务名"
                        rules={[{ required: true, message: '请输入服务名!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="描述">
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ServiceManagement;
