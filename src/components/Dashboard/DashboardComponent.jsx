import React, { useEffect, useState, useRef } from 'react';
import { Table, Card, message } from 'antd';
import axios from 'axios';
import * as echarts from 'echarts';

const DashboardComponent = () => {
    const [data, setData] = useState([]);
    const [serviceNames, setServiceNames] = useState({});
    const chartRef = useRef(null);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8888/api/queues/all');
            const rawData = response.data;

            // 过滤不合规定的数据
            const parsedData = rawData
                .map(item => {
                    // 定义数据匹配格式
                    const match = item.match(/DocumentLastFour: (\d+), QueueNumber: (\d+), ServiceId: (\d+), WindowId: (\d+), OrderNumber: (\w+-\d+)/);
                    if (match) {
                        const [, documentLastFour, queueNumber, serviceId, windowId, orderNumber] = match;
                        return {
                            documentLastFour,
                            queueNumber,
                            serviceId,
                            windowId,
                            orderNumber
                        };
                    }
                    return null;
                })
                .filter(item => item !== null); // 移除无效数据

            if (parsedData.length === 0) {
                message.info("没有符合格式的数据");
            }

            // 获取服务名称
            const serviceIds = [...new Set(parsedData.map(item => item.serviceId))];
            if (serviceIds.length === 0) {
                setData(parsedData);
                return;
            }

            const serviceRequests = serviceIds.map(id =>
                axios.get(`http://localhost:8888/api/services/${id}`)
            );

            const serviceResponses = await Promise.all(serviceRequests);
            const services = {};

            serviceResponses.forEach(response => {
                // 处理不同的数据结构
                const serviceData = response.data;
                const id = serviceData?.id || serviceData?.data?.id; // 兼容不同的数据结构
                const description = serviceData?.description || serviceData?.data?.description;

                if (id) {
                    services[id] = description;
                }
            });

            setServiceNames(services);
            setData(parsedData);
        } catch (error) {
            console.error('Error fetching data:', error);
            message.error("数据获取失败");
        }
    };

    useEffect(() => {
        // 首次加载数据
        fetchData();

        // 每10秒刷新一次数据
        const interval = setInterval(() => {
            fetchData();
        }, 10000);

        // 清理计时器
        return () => clearInterval(interval);
    }, []);

    // 使用EChart定义数据大屏
    useEffect(() => {
        if (data.length > 0 && chartRef.current) {
            const chart = echarts.init(chartRef.current);
            const windowCount = {};

            // 对窗口数量进行计数
            data.forEach(item => {
                const windowId = item.windowId;
                windowCount[windowId] = (windowCount[windowId] || 0) + 1;
            });

            const options = {
                xAxis: {
                    type: 'category',
                    data: Object.keys(windowCount),
                    name: '窗口ID'
                },
                yAxis: {
                    type: 'value',
                    name: '排队数量'
                },
                series: [
                    {
                        data: Object.values(windowCount),
                        type: 'bar'
                    }
                ]
            };

            chart.setOption(options);

            // 清理 ECharts 实例
            return () => {
                chart.dispose();
            };
        }
    }, [data]);

    const columns = [
        {
            title: '证件号最后四位',
            dataIndex: 'documentLastFour',
            key: 'documentLastFour'
        },
        {
            title: '排队号码',
            dataIndex: 'queueNumber',
            key: 'queueNumber'
        },
        {
            title: '服务名称',
            dataIndex: 'serviceId',
            key: 'serviceId',
            render: (serviceId) => {
                const serviceName = serviceNames[serviceId];
                return serviceName || '加载中...';
            }
        },
        {
            title: '窗口号',
            dataIndex: 'windowId',
            key: 'windowId'
        },
        {
            title: '订单号',
            dataIndex: 'orderNumber',
            key: 'orderNumber'
        }
    ];

    return (
        <div>
            <Card title="叫号数据">
                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey="orderNumber"
                    pagination={false}
                />
            </Card>
            <Card title="窗口排队数量">
                <div ref={chartRef} style={{ height: 400 }}></div>
            </Card>
        </div>
    );
};

export default DashboardComponent;
