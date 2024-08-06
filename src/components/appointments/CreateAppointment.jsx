import React, { useState, useEffect } from "react";
import { Button, Form, Input, DatePicker, Radio, Select, message, Space, ConfigProvider } from "antd";
import locale from "antd/locale/zh_CN"; // 引入 Ant Design 的中文本地化设置
import axios from "axios"; // 用于发送 HTTP 请求
import dayjs from "dayjs"; // 用于处理日期
import 'dayjs/locale/zh-cn'; // 引入 dayjs 的中文本地化
import { submitFormData } from "../../api/form"; // 引入用于提交表单数据的 API 函数

const { RangePicker } = DatePicker; // 解构赋值，获取日期范围选择器组件
dayjs.locale('zh-cn'); // 设置 dayjs 的语言为中文

const CreateAppointment = () => {
    const API_BASE_URL = 'http://127.0.0.1:8888'; // API 基础 URL
    const [form] = Form.useForm(); // 创建表单实例，用于管理表单状态
    const [docType, setDocType] = useState('idCard'); // 初始化身份证类型，默认值为 'idCard'
    const [countryCode, setCountryCode] = useState('+86'); // 初始化国家区号，默认值为 '+86'
    const [serviceTypes, setServiceTypes] = useState([]); // 初始化服务类型列表，默认为空数组

    // 使用 useEffect 钩子在组件挂载时获取服务类型数据
    useEffect(() => {
        const fetchServiceTypes = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/services`); // 发送 GET 请求获取服务类型
                setServiceTypes(response.data); // 设置服务类型状态
            } catch (error) {
                console.error('获取预约服务类型失败:', error); // 捕获并打印错误
            }
        };

        fetchServiceTypes(); // 调用函数获取数据

    }, []); // 依赖空数组，仅在组件挂载时执行一次

    // 国家区号更改时的处理函数
    const onCountryCodeChange = (value) => {
        setCountryCode(value); // 更新国家区号状态
    };

    // 手机号码验证器，基于国家区号验证格式
    const phoneValidator = (_, value) => {
        const phonePattern = {
            '+86': /^1[3-9]\d{9}$/, // 中国手机号码正则
            '+1': /^[2-9]\d{2}-\d{3}-\d{4}$/, // 美国手机号码正则
        };

        const pattern = phonePattern[countryCode]; // 根据当前国家区号选择对应正则
        if (value && pattern && !pattern.test(value)) {
            return Promise.reject(new Error('请输入有效的手机号')); // 返回验证失败信息
        }
        return Promise.resolve(); // 验证成功
    };

    // 身份证号码验证器
    const idCardValidator = (_, value) => {
        const idCardPattern = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}(\d|X|x)$/;
        if (value && !idCardPattern.test(value)) {
            return Promise.reject(new Error('请输入有效的中国居民身份证号码')); // 返回验证失败信息
        }
        return Promise.resolve(); // 验证成功
    };

    // 护照号码验证器
    const passportValidator = (_, value) => {
        const passportPattern = /^[a-zA-Z]{5,17}$/;
        if (value && !passportPattern.test(value)) {
            return Promise.reject(new Error('请输入有效的护照号码')); // 返回验证失败信息
        }
        return Promise.resolve(); // 验证成功
    };

    // 文档类型更改时的处理函数
    const onDocTypeChange = (e) => {
        setDocType(e.target.value); // 更新文档类型状态
        form.resetFields(['documentNumber']); // 重置表单中的文档号码字段
    };

    // 表单提交成功时的处理函数
    const onFinish = async (values) => {
        try {
            const appointmentData = {
                serviceId: values.serviceType, // 预约服务类型 ID
                username : values.username, // 用户名
                phoneNumber: values.phone, // 电话号码
                documentType: docType, // 文档类型
                documentNumber: values.documentNumber, // 文档号码
                appointmentDate: values.daterange.format('YYYY-MM-DD'), // 预约日期，格式化为 YYYY-MM-DD
                status: values.status // 预约状态
            };
            await axios.post(`${API_BASE_URL}/api/appointments`, appointmentData); // 发送 POST 请求提交预约数据
            message.success('预约提交成功'); // 显示成功消息
            form.resetFields(); // 重置表单
        } catch (error) {
            console.error('错误提交:', error); // 捕获并打印错误
            message.error('预约提交失败'); // 显示失败消息
        }
    };

    // 表单提交失败时的处理函数
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo); // 打印失败信息
    };

    return (
        <ConfigProvider locale={locale}>
            <Form
                form={form}
                name="createAppointment"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                style={{ maxWidth: 600 }}
            >

                <Form.Item
                    label="姓名"
                    name="username"
                    rules={[{ required: true, message: '请输入您的姓名!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label="证件类型" name="docType">
                    <Radio.Group onChange={onDocTypeChange} value={docType}>
                        <Radio value="idCard">中国居民身份证</Radio>
                        <Radio value="passport">护照</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    name="documentNumber"
                    label="证件号码"
                    rules={[
                        { required: true, message: '请输入证件号码' },
                        { validator: docType === 'idCard' ? idCardValidator : passportValidator },
                    ]}
                >
                    <Input placeholder="请输入证件号码" />
                </Form.Item>

                <Form.Item
                    label="性别"
                    name="gender"
                    rules={[{ required: true, message: '请选择您的性别!' }]}
                >
                    <Radio.Group buttonStyle="solid" >
                        <Radio.Button value="男">男</Radio.Button>
                        <Radio.Button value="女">女</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    label="预约服务"
                    name="serviceType"
                    rules={[{ required: true, message: '请选择预约服务类型!' }]}
                >
                    <Select placeholder="请选择服务类型">
                        {serviceTypes.map(service => (
                            <Select.Option key={service.serviceId} value={service.serviceId}>
                                {service.description}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="预约时间"
                    name="daterange"
                    rules={[{ required: true, message: '请选择您的预约时间!' }]}
                >
                    <DatePicker />
                </Form.Item>

                <Form.Item
                    label="手机号"
                    name="phone"
                    rules={[
                        { required: true, message: '请输入您的手机号!' },
                        { validator: phoneValidator },
                    ]}
                >
                    <Input
                        addonBefore={
                            <Select defaultValue={countryCode} onChange={onCountryCodeChange} style={{ width: 80 }}>
                                <Select.Option value="+86">+86</Select.Option>
                                <Select.Option value="+1">+1</Select.Option>
                            </Select>
                        }
                    />
                </Form.Item>

                <Form.Item
                    label="预约状态"
                    name="status"
                    rules={[{ required: true, message: '请选择预约状态!' }]}
                >
                    <Select placeholder="请选择预约状态">
                        <Select.Option value="pending">待处理</Select.Option>
                        <Select.Option value="confirmed">已确认</Select.Option>
                        <Select.Option value="cancelled">已取消</Select.Option>
                        <Select.Option value="completed">已完成</Select.Option>
                        <Select.Option value="unfinished">未完成</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </Form.Item>
            </Form>
        </ConfigProvider>
    );
};

export default CreateAppointment;
