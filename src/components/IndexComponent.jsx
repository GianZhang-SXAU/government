import React, { useState, useEffect } from 'react';
import { Layout, Menu, Table, Card } from 'antd';
import ReactEcharts from 'echarts-for-react';
import axios from 'axios';

const { Header, Content, Footer } = Layout;

const IndexComponent = () => {
    const [userName, setUserName] = useState(null); // 用户名状态
    const [serviceData, setServiceData] = useState([]); // 服务数据
    const [queueData, setQueueData] = useState([]); // 排队数据

    useEffect(() => {
        // 模拟从服务器获取数据
        const fetchData = async () => {
            // 模拟服务类别数据
            const serviceResponse = [
                { service: '户籍办理', appointments: 120 },
                { service: '社保服务', appointments: 80 },
                { service: '医疗保障', appointments: 50 }
            ];

            // 模拟排队数据
            const queueResponse = [
                { id: 1, phone: '13800138000', status: '等待中' },
                { id: 2, phone: '13800138001', status: '办理中' },
                { id: 3, phone: '13800138002', status: '已完成' }
            ];

            setServiceData(serviceResponse);
            setQueueData(queueResponse);
        };

        fetchData();
    }, []);

    const getOption = () => {
        return {
            title: {
                text: '服务类别预约统计'
            },
            tooltip: {},
            xAxis: {
                type: 'category',
                data: serviceData.map(item => item.service)
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: serviceData.map(item => item.appointments),
                    type: 'bar'
                }
            ]
        };
    };

    const columns = [
        {
            title: '编号',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone'
        },
        {
            title: '当前状态',
            dataIndex: 'status',
            key: 'status'
        }
    ];

    return (
                <div className="site-layout-content" style={{ margin: '16px 0' }}>
                    <Card>
                        <h2>
                            {userName
                                ? `欢迎${userName}使用政务服务大厅预约与排队系统`
                                : '欢迎使用政务服务大厅预约与排队系统，请先登录'}
                        </h2>
                    </Card>
                    <Card>
                        <ReactEcharts option={getOption()} />
                    </Card>
                    <Card title="当前排队数据" style={{ marginTop: 16 }}>
                        <Table columns={columns} dataSource={queueData} rowKey="id" />
                    </Card>
                </div>
    );
};

export default IndexComponent;
