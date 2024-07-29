// src/components/QueueManagement.js
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Table, message, Modal } from 'antd';
import axios from 'axios';

const { Column } = Table;

const QueueManagement = () => {
    const [documentNumber, setDocumentNumber] = useState('');
    const [queues, setQueues] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingQueue, setEditingQueue] = useState(null);
    const [form] = Form.useForm();
    const API_URL = 'http://127.0.0.1:8888';

    useEffect(() => {
        fetchAllQueues();
    }, []);

    const fetchAllQueues = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/queues`);
            setQueues(response.data);
        } catch (error) {
            message.error('Failed to fetch all queue information');
        }
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/queues/byDocumentNumber?documentNumber=${documentNumber}`);
            setQueues(response.data);
        } catch (error) {
            message.error('Failed to fetch queue information');
        }
    };

    const generateQueueNumber = () => {
        return Math.floor(10000000 + Math.random() * 90000000);
    };

    const handleAddQueue = async () => {
        const queueNumber = generateQueueNumber();
        // Add your logic to save the new queue
    };

    const handleEditQueue = queue => {
        setEditingQueue(queue);
        form.setFieldsValue(queue);
        setIsModalVisible(true);
    };

    const handleDeleteQueue = async queueId => {
        try {
            await axios.delete(`${API_URL}/api/queues/${queueId}`);
            message.success('Queue deleted successfully');
            fetchAllQueues();
        } catch (error) {
            message.error('Failed to delete queue');
        }
    };

    const handleOk = async () => {
        try {
            await axios.put(`${API_URL}/api/queues/${editingQueue.queueId}`, form.getFieldsValue());
            message.success('Queue updated successfully');
            setIsModalVisible(false);
            fetchAllQueues();
        } catch (error) {
            message.error('Failed to update queue');
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div>
            <Form layout="inline">
                <Form.Item label="Document Number">
                    <Input value={documentNumber} onChange={e => setDocumentNumber(e.target.value)} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={handleSearch}>Search</Button>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={handleAddQueue}>Add Queue</Button>
                </Form.Item>
            </Form>
            <Table dataSource={queues} rowKey="queueId">
                <Column title="Queue ID" dataIndex="queueId" key="queueId" />
                <Column title="Appointment ID" dataIndex="appointmentId" key="appointmentId" />
                <Column title="Queue Number" dataIndex="queueNumber" key="queueNumber" />
                <Column title="Queue Status" dataIndex="queueStatus" key="queueStatus" />
                <Column title="Called Time" dataIndex="calledTime" key="calledTime" />
                <Column title="Window ID" dataIndex="windowId" key="windowId" />
                <Column
                    title="Action"
                    key="action"
                    render={(text, record) => (
                        <span>
              <Button onClick={() => handleEditQueue(record)}>Edit</Button>
              <Button onClick={() => handleDeleteQueue(record.queueId)} style={{ marginLeft: 8 }}>Delete</Button>
            </span>
                    )}
                />
            </Table>
            <Modal
                title="Edit Queue"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="queueNumber" label="Queue Number">
                        <Input />
                    </Form.Item>
                    <Form.Item name="queueStatus" label="Queue Status">
                        <Input />
                    </Form.Item>
                    <Form.Item name="calledTime" label="Called Time">
                        <Input />
                    </Form.Item>
                    <Form.Item name="windowId" label="Window ID">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default QueueManagement;
