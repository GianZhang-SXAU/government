// src/components/QueueManagement.js
import React, { useState, useEffect } from 'react';
import {Form, Input, Button, Table, message, Modal, Tag, Select} from 'antd';
import axios from 'axios';

const { Column } = Table;

const QueueManagement = () => {
    const [documentNumber, setDocumentNumber] = useState('');
    const [queues, setQueues] = useState([]);
    const [windows, setWindows] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingQueue, setEditingQueue] = useState(null);
    const [form] = Form.useForm();
    const API_URL = 'http://127.0.0.1:8888';



    useEffect(() => {
        fetchAllQueues();
        fetchAllWindows();
    }, []);

    /*
     * @Author: 张建安
     * @Date: 2024/8/24
     * @Param：
     * @Return：
     * @Description：获取所有排队信息
     * */
    const fetchAllQueues = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/queues`);
            setQueues(response.data);
        } catch (error) {
            message.error('查询所有叫号信息失败');
        }
    };

    /*
     * @Author: 张建安
     * @Date: 2024/8/24
     * @Param：
     * @Return：
     * @Description：获取所有窗口信息
     * */
    const fetchAllWindows = async () => {
        try {
            const response = await axios.get(`${API_URL}/windows`)
            console.info(response);
            setWindows(response.data);
        } catch (error) {
            console.log("查询窗口信息失败："+error);
            message.error("查询窗口信息失败")
        }
    }

    /*
     * @Author: 张建安
     * @Date: 2024/8/24
     * @Param：
     * @Return：
     * @Description：根据身份证号查询排队信息
     * */
    const handleSearch = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/api/queues/byDocumentNumber?documentNumber=${documentNumber}`);
            setQueues(response.data);
        } catch (error) {
            message.error('查询叫号信息失败！');
        }
    };

    /*
     * @Author: 张建安
     * @Date: 2024/8/24
     * @Param：
     * @Return：
     * @Description：生成4位数的“叫号”
     * */
    const generateQueueNumber = () => {
        return Math.floor(10000000 + Math.random() * 90000000);
    };

    /*
     * @Author: 张建安
     * @Date: 2024/8/24
     * @Param：
     * @Return：
     * @Description：添加排队信息
     * */
    // const handleAddQueue = async () => {
    //     const queueNumber = generateQueueNumber();
    //     // TODO 编写添加排队信息的方法，但原则上不建议这样做，暂不做此方法
    // };

    /*
     * @Author: 张建安
     * @Date: 2024/8/24
     * @Param：queue（对象）
     * @Description：编辑排队信息的填充表单的方法
     * */
    const handleEditQueue = queue => {
        setEditingQueue(queue);
        form.setFieldsValue(queue);
        setIsModalVisible(true);
    };

    /*
     * @Author: 张建安
     * @Date: 2024/8/24
     * @Description：删除队列的方法
     * */
    const handleDeleteQueue = async queueId => {
        try {
            await axios.delete(`${API_URL}/api/queues/${queueId}`);
            message.success('成功删除队列');
            fetchAllQueues();
        } catch (error) {
            message.error('删除队列失败');
        }
    };

    /*
     * @Author: 张建安
     * @Date: 2024/8/24
     * @Description：删除队列的方法
     * */
    const handleOk = async () => {
        try {
            await axios.put(`${API_URL}/api/queues/${editingQueue.queueId}`, form.getFieldsValue());
            message.success('队列更新成功');
            setIsModalVisible(false);
            fetchAllQueues();
        } catch (error) {
            message.error('更新队列失败');
        }
    };

    // 取消编辑的方法
    const handleCancel = () => {
        setIsModalVisible(false);
    };


    const statusMap = {
        waiting: '请等待',
        processing: '进行中',
        completed: '已完成',
    };

    const statusColorMap = {
        waiting: '#faad14', // 黄色
        processing: '#52c41a', // 绿色
        completed: '#2db7f5', // 蓝色
    };

    const columns = [
        {
            title:"排队ID",
            dataIndex: 'queueId',
            key: 'queueId',
        },
        {
            title:"预约ID",
            dataIndex: 'appointmentId',
            key: 'appointmentId',
        },
        {
            title:"号码",
            dataIndex: 'queueNumber',
            key: 'queueNumber',
        },
        {
            title:"排队状态",
            dataIndex: 'queueStatus',
            key: 'queueStatus',
            render: (text) => (
                <Tag color={statusColorMap[text] || '#363636'}>
                    {statusMap[text]}
                </Tag>
            )
        },
        {
            title:"叫号时间",
            dataIndex: 'calledTime',
            key: 'calledTime',
        },
        {
            title:"窗口名称",
            dataIndex: 'windowId',
            key: 'windowId',
            render: (windowId) => windows.find(w => w.windowId === windowId)?.windowName
        },
        {
            title:"操作",
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button type="primary" onClick={() => handleEditQueue(record)}>
                        编辑
                    </Button>
                    <Button onClick={() => handleDeleteQueue(record.queueId)}
                            style={{ marginLeft: 8 }}>
                        删除
                    </Button>
                </span>
            )
        },
    ]

    return (
        <div>
            {/*使用身份证号查询排队信息的搜索框*/}
            <Form layout="inline">
                <Form.Item label="身份证号">
                    <Input value={documentNumber} onChange={e => setDocumentNumber(e.target.value)} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={handleSearch}>搜索</Button>
                </Form.Item>

            </Form>

            {/*展示所有的排队信息*/}
            <Table
                dataSource={queues}
                rowKey="queueId"
                columns={columns}
            />


            {/*编辑排队信息的表单*/}
            <Modal
                title="编辑排队信息"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >

                <Form form={form} layout="vertical">

                    <Form.Item
                        name="queueStatus"
                        label="排队状态">
                        <Select>
                            {Object.keys(statusMap).map(key => (
                                <Select.Option key={key} value={key}>
                                    {statusMap[key]}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="windowId"
                        label="窗口">
                        <Select>
                            {windows.map(window => (
                                <Select.Option key={window.windowId} value={window.windowId}>
                                    {window.windowName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                </Form>
            </Modal>

        </div>
    );
};

export default QueueManagement;
