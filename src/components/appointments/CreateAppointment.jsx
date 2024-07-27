import React, { useState, useEffect } from "react";
import { Button, Form, Input, DatePicker, Radio, Select, message, Space, ConfigProvider } from "antd";
import locale from "antd/locale/zh_CN";
import axios from "axios";
import dayjs from "dayjs";
import 'dayjs/locale/zh-cn';
import { submitFormData } from "../../api/form";

const { RangePicker } = DatePicker;
dayjs.locale('zh-cn');

const CreateAppointment = () => {
    const API_BASE_URL = 'http://127.0.0.1:8888';
    const [form] = Form.useForm();
    const [docType, setDocType] = useState('idCard');
    const [countryCode, setCountryCode] = useState('+86');
    const [serviceTypes, setServiceTypes] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchServiceTypes = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/services`);
                setServiceTypes(response.data);
            } catch (error) {
                console.error('获取预约服务类型失败:', error);
            }
        };

        fetchServiceTypes();

    }, []);

    const onCountryCodeChange = (value) => {
        setCountryCode(value);
    };

    const phoneValidator = (_, value) => {
        const phonePattern = {
            '+86': /^1[3-9]\d{9}$/, // 中国
            '+1': /^[2-9]\d{2}-\d{3}-\d{4}$/, // 美国
        };

        const pattern = phonePattern[countryCode];
        if (value && pattern && !pattern.test(value)) {
            return Promise.reject(new Error('请输入有效的手机号'));
        }
        return Promise.resolve();
    };

    const idCardValidator = (_, value) => {
        const idCardPattern = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}(\d|X|x)$/;
        if (value && !idCardPattern.test(value)) {
            return Promise.reject(new Error('请输入有效的中国居民身份证号码'));
        }
        return Promise.resolve();
    };

    const passportValidator = (_, value) => {
        const passportPattern = /^[a-zA-Z]{5,17}$/;
        if (value && !passportPattern.test(value)) {
            return Promise.reject(new Error('请输入有效的护照号码'));
        }
        return Promise.resolve();
    };

    const onDocTypeChange = (e) => {
        setDocType(e.target.value);
        form.resetFields(['documentNumber']);
    };

    const onFinish = async (values) => {
        try {
            const appointmentData = {
                serviceId: values.serviceType,
                phoneNumber: values.phone,
                documentType: docType,
                documentNumber: values.documentNumber,
                appointmentDate: values.daterange[0].format('YYYY-MM-DD'),
                appointmentTime: values.daterange[1].format('HH:mm:ss'),
                status: values.status
            };
            await axios.post(`${API_BASE_URL}/api/appointments`, appointmentData);
            message.success('预约提交成功');
            form.resetFields();
        } catch (error) {
            console.error('错误提交:', error);
            message.error('预约提交失败');
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
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
                    <Radio.Group buttonStyle="solid" defaultValue="男">
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
                    <DatePicker showTime  />
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
