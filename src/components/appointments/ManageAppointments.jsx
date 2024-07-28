import React, { useEffect, useState } from "react";
import {Table, Button, Popconfirm, message, Tag, Select, Form, Modal, Input, DatePicker, Radio} from "antd";
import axios from "axios";
import moment from "moment";

const ManageAppointments = () => {
    const API_BASE_URL = 'http://127.0.0.1:8888';
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [currentAppointment, setCurrentAppointment] = useState(null);
    const [form] = Form.useForm();
    const [documentType, setdocumentType] = useState('idCard');

    const phoneValidator = (_, value) => {

        const pattern = /^1[3-9]\d{9}$/;
        if (value && !pattern.test(value)) {
            return Promise.reject(new Error('请输入有效的手机号'));
        }
        return Promise.resolve();
    };

    // 身份证号码的正则表达式验证规则
    const idCardValidator = (_, value) => {
        const idCardPattern = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}(\d|X|x)$/;
        if (value && !idCardPattern.test(value)) {
            return Promise.reject(new Error('请输入有效的中国居民身份证号码'));
        }
        return Promise.resolve();
    };

    // 护照号码的正则表达式验证规则
    const passportValidator = (_, value) => {
        const passportPattern = /^[a-zA-Z]{5,17}$/;
        if (value && !passportPattern.test(value)) {
            return Promise.reject(new Error('请输入有效的护照号码'));
        }
        return Promise.resolve();
    };

    const onDocTypeChange = (e) => {
        setdocumentType(e.target.value);
        form.resetFields(['documentNumber']);
    };


    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/appointments`);
            setAppointments(response.data);
        } catch (error) {
            console.error('获取预约信息失败:', error);
            message.error('获取预约信息失败');
        } finally {
            setLoading(false);
        }
    };

    const fetchServices = async () => {
        const result = await axios.get(`${API_BASE_URL}/api/services`);
        setServices(result.data);
    };

    useEffect(() => {
        fetchAppointments();
        fetchServices();
    }, []);

    const handleDelete = async (appointmentId) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/appointments/${appointmentId}`);
            message.success('预约删除成功');
            fetchAppointments();
        } catch (error) {
            console.error('删除预约失败:', error);
            message.error('删除预约失败');
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (currentAppointment) {
                await axios.put(`${API_BASE_URL}/api/appointments/${currentAppointment.appointmentId}`, values);
                message.success('预约修改成功');
            } else {
                await axios.post(`${API_BASE_URL}/api/appointments`, values);
                message.success('预约添加成功');
            }
            fetchAppointments();
            setModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error('保存预约失败:', error);
            message.error('保存预约失败');
        }
    };

    const handleEdit = (appointment) => {
        setCurrentAppointment(appointment);
        setModalTitle('修改预约');
        setModalVisible(true);
        form.setFieldsValue({
            ...appointment,
            appointmentDate: appointment.appointmentDate ? moment(appointment.appointmentDate) : null
        });
    };

    const handleAdd = () => {
        setCurrentAppointment(null);
        setModalTitle('新增预约');
        setModalVisible(true);
        form.resetFields();
    };

    const documentTypeMap = {
        idCard: '身份证',
        passport: '护照',
        DRIVER_LICENSE: '驾驶证',
        // 其他证件类型映射
    };

    const statusMap = {
        pending: '待处理',
        confirmed: '已确认',
        cancelled: '已取消',
        completed: '已完成',
        unfinished: '未完成',
    };

    const statusColorMap = {
        pending: '#faad14', // 黄色
        confirmed: '#52c41a', // 绿色
        cancelled: '#f5222d', // 红色
        completed: '#2db7f5', // 蓝色
        unfinished: '#d9d9d9', // 灰色
    };

    const documentTypeColorMap = {
        idCard: '#108ee9', // 蓝色
        passport: '#87d068', // 绿色
        DRIVER_LICENSE: '#f50', // 红色
        // 其他证件类型颜色
    };

    const columns = [
        {
            title: '预约ID',
            dataIndex: 'appointmentId',
            key: 'appointmentId',
        },
        {
            title: '预约人',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '服务ID',
            dataIndex: 'serviceId',
            key: 'serviceId',
            render: (serviceId) => services.find(s => s.serviceId === serviceId)?.description
        },
        {
            title: '手机号',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: '证件类型',
            dataIndex: 'documentType',
            key: 'documentType',
            render: (text) => (
                <Tag color={documentTypeColorMap[text] || '#363636'}>
                    {documentTypeMap[text]}
                </Tag>
            ),
        },
        {
            title: '证件号',
            dataIndex: 'documentNumber',
            key: 'documentNumber',
        },
        {
            title: '预约日期',
            dataIndex: 'appointmentDate',
            key: 'appointmentDate',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (text) => (
                <Tag color={statusColorMap[text] || '#363636'}>
                    {statusMap[text]}
                </Tag>
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <>
                    <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
                    <Popconfirm
                        title="确定要删除这条预约吗？"
                        onConfirm={() => handleDelete(record.appointmentId)}
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
            <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
                新增预约
            </Button>
            <Table
                columns={columns}
                dataSource={appointments}
                rowKey="appointmentId"
                loading={loading}
            />
            <Modal
                title={modalTitle}
                visible={modalVisible}
                onOk={handleModalOk}
                onCancel={() => setModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="username"
                        label="预约人"
                        rules={[{ required: true, message: '请输入预约人' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="serviceId"
                        label="服务"
                        rules={[{ required: true, message: '请选择服务' }]}
                    >
                        <Select>
                            {services.map(service => (
                                <Select.Option key={service.serviceId} value={service.serviceId}>
                                    {service.description}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="phoneNumber"
                        label="手机号"
                        rules={[{ required: true, message: '请输入手机号' },{validator: phoneValidator}]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="证件类型" name="documentType">
                        <Radio.Group onChange={onDocTypeChange} value={documentType}>
                            <Radio value="idCard">中国居民身份证</Radio>
                            <Radio value="passport">护照</Radio>
                        </Radio.Group>
                    </Form.Item>

                    {documentType === 'idCard' && (
                        <Form.Item
                            name="documentNumber"
                            label="身份证号码"
                            rules={[
                                { required: true, message: '请输入身份证号码' },
                                { validator: idCardValidator },
                            ]}
                        >
                            <Input placeholder="请输入身份证号码" />
                        </Form.Item>
                    )}

                    {documentType === 'passport' && (
                        <Form.Item
                            name="documentNumber"
                            label="护照号码"
                            rules={[
                                { required: true, message: '请输入护照号码' },
                                { validator: passportValidator },
                            ]}
                        >
                            <Input placeholder="请输入护照号码" />
                        </Form.Item>
                    )}
                    <Form.Item
                        name="appointmentDate"
                        label="预约日期"
                        rules={[{ required: true, message: '请选择预约日期' }]}
                    >
                        <DatePicker />
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="状态"
                        rules={[{ required: true, message: '请选择状态' }]}
                    >
                        <Select>
                            {Object.keys(statusMap).map(key => (
                                <Select.Option key={key} value={key}>
                                    {statusMap[key]}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ManageAppointments;
