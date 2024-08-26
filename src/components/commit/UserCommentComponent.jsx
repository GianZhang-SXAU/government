import React, {useEffect, useState} from 'react';
import {Button, Form, Input, message, Modal, Popconfirm, Select, Table} from "antd";
import axios from "axios";
import moment from "moment";
import {useSelector} from "react-redux";

/*
* @Author: 张建安
* @Data: 2024/8/26
* @Description：留言管理相关界面
* */
const UserCommentComponent = () => {

// TODO 开发环境中使用该地址，在实际生产环境进行更换
    const API_BASE_URL = 'http://127.0.0.1:8888/api/commit';
    // TODO 开发环境中使用该地址，在实际生产环境进行更换
    const API_SERVICE_URL = 'http://127.0.0.1:8888/api/services';
    const API_USERS_URL = 'http://127.0.0.1:8888/api/users';
    //React Hook区
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState([]);
    const [users, setUsers] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [currentComment, setCurrentComment] = useState(null);
    const [form] = Form.useForm();

    const user = useSelector((state) => state.user.data);


    /*
    * @Author: 张建安
    * @Date: 2024/8/24
    * @Param：
    * @Return：
    * @Description：获取所有留言
    * */
    const fetchUserComments = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/comment/user?idCard=${user.idCard}`);
            setComments(response.data);
        } catch (error) {
            console.error('获取留言信息失败:', error);
            message.error('获取留言信息失败');
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
        fetchUserComments();
        fetchServices();
        fetchUsers();
    }, []);

    /*
    * @Author: 张建安
    * @Date: 2024/8/24
    * @Param：
    * @Return：
    * @Description：添加与修改留言的请求方法
    * */
    const handleModalOk = async () => {
        try {
            // 设置请求的参数值
            const values = await form.validateFields();
            // // 通过User的ID值，查询一下是哪位用户
            // const user = users.find(u => u.idCard === values.idCard);
            // if (!user) {
            //     message.error('未找到对应的用户');
            //     return;
            // }
            // 定义一个方法，用来对发生的数据对象进行解构，然后修改userId的值
            const dataToSend = {
                ...values,
                userId: user.userId,
                serviceId: currentComment.serviceId,
                createdAt: currentComment.createdAt ? moment(currentComment.createdAt) : null,
                commentId: currentComment.commentId,
            };
            console.log(dataToSend);
            await axios.put(`${API_BASE_URL}/comment/update`, dataToSend);
            message.success('留言修改成功');
            // 响应成功后，刷新评论，重新渲染
            await fetchUserComments();
            setModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error('保存留言失败:', error);
            message.error('保存留言失败');
        }
    };

    /*
     * @Author: 张建安
     * @Date: 2024/8/24
     * @Param：
     * @Return：
     * @Description：修改留言的填充方法
     * */
    const handleEdit = (comment) => {
        const user = users.find(u => u.userId === comment.userId);
        setCurrentComment(comment);
        setModalTitle('修改留言');
        setModalVisible(true);
        form.setFieldsValue({
            ...comment,
            idCard: user?.idCard,
            serviceId: comment.serviceId,
            createdAt: comment.createdAt ? moment(comment.createdAt) : null,
        });
    };

    /*
    * @Author: 张建安
    * @Date: 2024/8/24
    * @Description：展示留言用的表单
    * */
    const columns = [
        {
            title: '留言ID',
            dataIndex: 'commentId',
            key: 'commentId',
        },
        {
            title: '服务人',
            dataIndex: 'userId',
            key: 'userId',
            render: (userId) => users.find(u => u.userId === userId)?.name,
        },
        {
            title: '服务内容',
            dataIndex: 'serviceId',
            key: 'serviceId',
            render: (serviceId) => services.find(s => s.serviceId === serviceId)?.description
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
                    <Button type="link" onClick={() => handleEdit(record)}>编辑留言</Button>
                </>
            ),
        },
    ];


    return (
      <>
      {/*展示所有留言*/}
      <Table
          columns={columns}
          dataSource={comments}
          rowKey="commentId"
          loading={loading}
      />
      {/*增加和修改留言的表单*/}
      <Modal
          title={modalTitle}
          visible={modalVisible}
          onOk={handleModalOk}
          onCancel={() => setModalVisible(false)}
      >
          <Form form={form} layout="vertical">

              <Form.Item
                  name="content"
                  label="留言内容"
                  rules={[{ required: true, message: '请输入留言内容' }]}
              >
                  <Input.TextArea />
              </Form.Item>
          </Form>
      </Modal>

      </>
    );
}

export default UserCommentComponent;