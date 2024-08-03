import { useEffect, useState } from "react";
import { Button, Checkbox, Drawer, Form, Input, message, Modal, Radio, Table } from "antd";
import axios from "axios";

const NumberComponent = () => {
    const [open, setOpen] = useState(false);
    const [documentNumber, setDocumentNumber] = useState("");
    const [data, setData] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false); // 控制Modal显示
    const [queueData, setQueueData] = useState(null); // 存储返回的Queue数据
    const [serviceNames, setServiceNames] = useState({}); // 存储服务名称

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
            <Button type="primary" onClick={showDrawer}>
                取号
            </Button>
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
