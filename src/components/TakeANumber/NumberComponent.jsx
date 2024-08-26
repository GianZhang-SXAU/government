import React, { useEffect, useState } from "react";
import {Button, Checkbox, Drawer, Form, Input, message, Modal, Radio, Select, Table, Tag} from "antd";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";

const NumberComponent = () => {
    // React Hook区
    const [open, setOpen] = useState(false);
    const [documentNumber, setDocumentNumber] = useState("");
    const [data, setData] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false); // 控制Modal显示
    const [queueData, setQueueData] = useState(null); // 存储返回的Queue数据
    const [serviceNames, setServiceNames] = useState({}); // 存储服务名称
    const [queues, setQueues] = useState([]);
    const [windows, setWindows] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingQueue, setEditingQueue] = useState(null);
    const [form] = Form.useForm();

    const user = useSelector((state) => state.user.data);
    const userType = useSelector((state) => state.user.type);

    const dispatch = useDispatch();

    const API_URL = 'http://127.0.0.1:8888';

    const handleQuery = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/queues/${documentNumber}`);
            console.log("后台返回数据:", response.data); // 调试信息

            const updatedData = await Promise.all(
                response.data.map(async (item) => {
                    const serviceResponse = await axios.get(`${API_URL}/api/services/${item.serviceId}`);
                    return {
                        ...item,
                        service_name: serviceResponse.data.description,
                    };
                })
            );

            console.log("更新后的数据:", updatedData); // 调试信息

            setData(updatedData); // 确保数据已更新
            setLoading(false);

            if (updatedData.length > 0) {
                setVisible(true); // 当数据更新时显示子 Drawer
            }

        } catch (error) {
            console.error("Error fetching appointment data:", error);
            message.error("查询失败，请重试");
            setLoading(false);
        }
    };

    const fetchServiceNames = async () => {
        const serviceResponse = await axios.get(`${API_URL}/api/services`);
        const serviceData = serviceResponse.data.reduce((acc, item) => {
            acc[item.serviceId] = item.description;
            return acc;
        }, {});
        setServiceNames(serviceData);
    };

    // 使用 useEffect 监听 data 的变化，重新渲染表格
    useEffect(() => {
        console.log("数据改变:", data);

        if (data.length > 0) {
            setVisible(true); // 当数据更新时显示子 Drawer
        }

    }, [data]);

    const handleSelectChange = (selectedRowKeys, selectedRows) => {
        setSelectedRow(selectedRows[0]); // 只允许选择一个
    };

    const handleSubmit = async () => {
        if (!selectedRow) {
            message.warning("请先选择一个预约订单");
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/api/queues/queuemethod`, selectedRow);
            setQueueData(response.data); // 存储返回的Queue数据
            await fetchServiceNames(); // 获取服务名称
            setModalVisible(true); // 显示Modal
            message.success("查询成功，数据已提交");
            console.log("Submitted data:", response.data);
            await handleSearch();
        } catch (error) {
            console.error("Error submitting selected data:", error);
            message.error("提交失败，请重试");
        }
    };

    const columns = [
        {
            title: "选择",
            dataIndex: "select",
            render: (_, record) => (
                <Radio
                    checked={selectedRow && selectedRow.appointmentId === record.appointmentId}
                    onChange={() => handleSelectChange([record.appointmentId], [record])}
                />
            ),
        },
        {
            title: "预约ID",
            dataIndex: "appointmentId",
            key: "appointmentId",
        },
        {
            title: "预约人姓名",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "服务",
            dataIndex: "service_name",
            key: "service_name",
        },
        {
            title: "手机号",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
        },
        {
            title: "证件类型",
            dataIndex: "documentType",
            key: "documentType",
        },
        {
            title: "预约状态",
            dataIndex: "status",
            key: "status",
        },
    ];

    const queueColumns = [
        {
            title: "字段名",
            dataIndex: "key",
            key: "key",
            render: (text) => {
                switch (text) {
                    case "queueId":
                        return "队列ID";
                    case "appointmentId":
                        return "预约ID";
                    case "windowId":
                        return "窗口ID";
                    case "queueNumber":
                        return "队列号码";
                    case "queueStatus":
                        return "队列状态";
                    case "calledTime":
                        return "呼叫时间";
                    case "orderNumber":
                        return "订单号";
                    default:
                        return text;
                }
            },
        },
        {
            title: "值",
            dataIndex: "value",
            key: "value",
        },
    ];

    // 对叫号数据进行数据过滤与修改
    const queueDataSource = queueData
        ? Object.keys(queueData.queue)
            .filter((key) => key !== "queueId" && key !== "calledTime") // 过滤掉队列ID和呼叫时间
            .map((key) => {
                // 获取队列值并格式化
                const value = queueData.queue[key];
                const formattedValue =
                    (typeof value === 'number' && key === 'queueNumber'
                        ? value.toString().padStart(4, '0')
                        : value);

                return {
                    key: key,
                    value: formattedValue,
                };
            })
        : [];

    useEffect(() => {
        handleSearch();
        fetchAllWindows();
    }, []);


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
                `${API_URL}/api/queues/byDocumentNumber?documentNumber=${user.idCard}`);
            setQueues(response.data);
        } catch (error) {
            message.error('查询叫号信息失败！');
        }
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

        } catch (error) {
            message.error('删除队列失败');
        }
    };

    /*
   * @Author: 张建安
   * @Date: 2024/8/24
   * @Description：更新队列信息，更新表单中的数据并处理 createdAt 为空的情况
   * */
    const handleOk = async () => {
        try {
            // 获取表单中的值
            const formData = form.getFieldsValue();
            // 获取当前日期，格式化为 YYYY-MM-DD
            const currentDate = new Date().toISOString().split('T')[0];
            // 检查 createdAt 是否为空，若为空则赋予当前时间
            const updatedQueue = {
                ...editingQueue,  // 保留原始的队列数据
                ...formData,  // 覆盖表单中的新数据
                createdAt: editingQueue.createdAt || currentDate, // 若为空，赋予当前时间
            };
            // 发送更新请求
            await axios.put(`${API_URL}/api/queues/${editingQueue.queueId}`, updatedQueue);
            message.success('队列更新成功');
            setIsModalVisible(false);
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

    const columns2 = [
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
                    <Button onClick={() => handleDeleteQueue(record.queueId)}
                            style={{ marginLeft: 8 }}>
                        删除
                    </Button>
                </span>
            )
        },
    ]

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const onChildClose = () => {
        setVisible(false);
    };

    // JSX页面结构
    return (
        <>
            {/*取号功能按钮*/}
            <Button type="primary" onClick={showDrawer}>
                取号
            </Button>

            {/*展示所有的排队信息*/}
            <Table
                dataSource={queues}
                rowKey="queueId"
                columns={columns2}
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

            {/*  点击取号按钮，在桌边弹出取号抽屉  */}
            <Drawer title="取号" onClose={onClose} open={open} width={800}>
                <Form layout="inline" onFinish={handleQuery}>
                    <Form.Item label="证件号" >
                        <Input
                            value={documentNumber}
                            onChange={(e) => setDocumentNumber(e.target.value)}
                            placeholder="输入证件号"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            查询
                        </Button>
                    </Form.Item>
                </Form>
                {/*  2层抽屉，进行取号  */}
                <Drawer title="查询结果" onClose={onChildClose} open={visible} width={720}>
                    <Table
                        rowKey="appointmentId"
                        columns={columns}
                        dataSource={data}
                        pagination={false}
                    />
                    <Button
                        type="primary"
                        onClick={handleSubmit}
                        disabled={!selectedRow}
                        style={{ marginTop: "16px" }}
                    >
                        提交选择项
                    </Button>
                    <Modal
                        title="取号结果"
                        visible={modalVisible}
                        onOk={() => setModalVisible(false)}
                        onCancel={() => setModalVisible(false)}
                        footer={[
                            <Button key="close" type="primary" onClick={() => setModalVisible(false)}>
                                关闭
                            </Button>,
                        ]}
                    >
                        <Table
                            rowKey="key"
                            columns={queueColumns}
                            dataSource={queueDataSource}
                            pagination={false}
                        />
                    </Modal>
                </Drawer>
            </Drawer>
        </>
    );
};

export default NumberComponent;
