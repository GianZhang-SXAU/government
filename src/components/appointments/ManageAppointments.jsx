import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message } from "antd";
import axios from "axios";

const ManageAppointments = () => {
    const API_BASE_URL = 'http://127.0.0.1:8888';
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        fetchAppointments();
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

    const columns = [
        {
            title: '预约ID',
            dataIndex: 'appointmentId',
            key: 'appointmentId',
        },
        {
            title: '用户ID',
            dataIndex: 'userId',
            key: 'userId',
        },
        {
            title: '服务ID',
            dataIndex: 'serviceId',
            key: 'serviceId',
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
            title: '预约时间',
            dataIndex: 'appointmentTime',
            key: 'appointmentTime',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Popconfirm
                    title="确定要删除这条预约吗？"
                    onConfirm={() => handleDelete(record.appointmentId)}
                    okText="确定"
                    cancelText="取消"
                >
                    <Button type="link">删除</Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={fetchAppointments} style={{ marginBottom: 16 }}>
                刷新
            </Button>
            <Table
                columns={columns}
                dataSource={appointments}
                rowKey="appointmentId"
                loading={loading}
            />
        </div>
    );
};

export default ManageAppointments;
