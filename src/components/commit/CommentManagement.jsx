import React, {useState, useEffect} from 'react';
import {Button, Input, Form, message, Select, Table, Modal, Popconfirm} from 'antd';
import axios from 'axios';
import moment from "moment/moment";
/*
*
* @Author: 张建安
* @Date: 2024/8/24
* @Description：评论管理相关界面
*
* */

const CommentManagement = () => {
    // TODO 开发环境中使用该地址，在实际生产环境进行更换
    const API_BASE_URL = 'http://127.0.0.1:8888/api/commit';
    // TODO 开发环境中使用该地址，在实际生产环境进行更换
    const API_SERVICE_URL = 'http://127.0.0.1:8888/api/services';
    const API_USERS_URL = 'http://127.0.0.1:8888/api/users';
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState([]);
    const [users, setUsers] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [currentComment, setCurrentComment] = useState(null);
    const [form] = Form.useForm();


    /*
    * @Author: 张建安
    * @Date: 2024/8/24
    * @Param：
    * @Return：
    * @Description：获取所有评论
    * */
    const fetchComments = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/comments`);
            setComments(response.data);
        } catch (error) {
            console.error('获取评论信息失败:', error);
            message.error('获取评论信息失败');
        } finally {
            setLoading(false);
        }
    };
    /*
    * @Author: 张建安
    * @Date: 2024/8/24
    * @Param：
    * @Return：
    * @Description：获取所有服务
    * */
    const fetchServices = async () => {
        const result = await axios.get(`${API_SERVICE_URL}`);
        setServices(result.data);
    };
    /*
    * @Author: 张建安
    * @Date: 2024/8/24
    * @Param：
    * @Return：
    * @Description：获取所有用户
    * */
    const fetchUsers = async () => {
        const result = await axios.get(`${API_USERS_URL}`);
        setUsers(result.data);
    }


    useEffect(() => {
        fetchComments();
        fetchServices();
        fetchUsers();
    }, []);

    /*
    * @Author: 张建安
    * @Date: 2024/8/24
    * @Param：commentId
    * @Return：
    * @Description：删除评论
    * */
    const handleDelete = async (commentId) => {
        try {
            await axios.delete(`${API_BASE_URL}/${commentId}`);
            message.success('评论删除成功');
            fetchComments();
        } catch (error) {
            console.error('删除预约失败:', error);
            message.error('删除预约失败');
        }
    };


    /*
    * @Author: 张建安
    * @Date: 2024/8/24
    * @Param：
    * @Return：
    * @Description：添加与修改评论
    * */
    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (currentComment) {
                await axios.put(`${API_BASE_URL}/${currentComment.commentId}`, values);
                message.success('评论修改成功');
            } else {
                await axios.post(`${API_BASE_URL}`, values);
                message.success('预约添加成功');
            }
            fetchComments();
            setModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error('保存评论失败:', error);
            message.error('保存评论失败');
        }
    };


    /*
     * @Author: 张建安
     * @Date: 2024/8/24
     * @Param：
     * @Return：
     * @Description：获取所有评论
     * */
    const handleEdit = (comments) => {
        setCurrentComment(comments);
        setModalTitle('修改评论');
        setModalVisible(true);
        form.setFieldsValue({
            ...comments,
            createdAt: comments.createdAt ? moment(comments.createdAt) : null
        });
    };


    /*
     * @Author: 张建安
     * @Date: 2024/8/24
     * @Param：
     * @Return：
     * @Description：获取所有评论
     * */
    const handleAdd = () => {
        setCurrentComment(null);
        setModalTitle('新增评论');
        setModalVisible(true);
        form.resetFields();
    };

    const columns = [
        {
            title: '评论ID',
            dataIndex: 'commentId',
            key: 'commentId',
        },
        {
            title: '评论人证件号',
            dataIndex: 'userId',
            key: 'userId',
            render: (userId) => users.find(u => u.userId === userId)?.idCard,
        },
        {
            title: '服务内容',
            dataIndex: 'serviceId',
            key: 'serviceId',
            render: (serviceId) => services.find(s => s.serviceId === serviceId)?.description
        },
        {
            title: '评论内容',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
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
            <Button type="primary" onClick={handleAdd} style={{marginBottom: 16}}>
                新增评论
            </Button>
            <Table
                columns={columns}
                dataSource={comments}
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
                        rules={[{required: true, message: '请输入预约人'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        name="serviceId"
                        label="服务"
                        rules={[{required: true, message: '请选择服务'}]}
                    >
                        <Select>
                            {services.map(service => (
                                <Select.Option key={service.serviceId} value={service.serviceId}>
                                    {service.description}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

        </div>
    );
};

export default CommentManagement;
