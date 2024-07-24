import React, { useState } from "react";
import {Button, Checkbox, Form, Input, DatePicker, Space, ConfigProvider, Radio, Select} from "antd";
import locale from 'antd/locale/zh_CN';
import dayjs from 'dayjs';

import 'dayjs/locale/zh-cn';
import {submitFormData} from "../../api/form";

const { RangePicker } = DatePicker;
dayjs.locale('zh-cn');

const FormPage = () => {
    const [form] = Form.useForm();
    const [docType, setDocType] = useState('idCard');
    const [countryCode, setCountryCode] = useState('+86');

    const onCountryCodeChange = (value) => {
        setCountryCode(value);
    };

    const phoneValidator = (_, value) => {
        const phonePattern = {
            '+86': /^1[3-9]\d{9}$/, // 中国
            '+1': /^[2-9]\d{2}-\d{3}-\d{4}$/, // 美国
            // 可根据需要添加其他国家的正则表达式
        };

        const pattern = phonePattern[countryCode];
        if (value && pattern && !pattern.test(value)) {
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
        setDocType(e.target.value);
        form.resetFields(['idnum']);
    };

    const onFinish = async (values) => {
        console.log('Success:', values);
        try {
            const response = await submitFormData(values);
            console.log('服务器响应:', response);
        } catch (error) {
            console.error('错误提交:', error);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            快捷预约
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{
                    maxWidth: 600,
                }}
                initialValues={{
                    remember: true,
                }}
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="姓名"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: '请输入您的姓名!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label="证件类型" name="docType">
                    <Radio.Group onChange={onDocTypeChange} value={docType}>
                        <Radio value="idCard">中国居民身份证</Radio>
                        <Radio value="passport">护照</Radio>
                    </Radio.Group>
                </Form.Item>

                {docType === 'idCard' && (
                    <Form.Item
                        name="idnum"
                        label="身份证号码"
                        rules={[
                            { required: true, message: '请输入身份证号码' },
                            { validator: idCardValidator },
                        ]}
                    >
                        <Input placeholder="请输入身份证号码" />
                    </Form.Item>
                )}

                {docType === 'passport' && (
                    <Form.Item
                        name="idnum"
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
                    label="性别"
                    name="sex"
                    rules={[
                        {
                            required: true,
                            message: '请输入您的性别!',
                        },
                    ]}
                >
                    <Radio.Group buttonStyle="solid" defaultValue="男">
                        <Radio.Button value="男">男</Radio.Button>
                        <Radio.Button value="女">女</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    label="预约服务"
                    name="serviceType"
                    rules={[
                        {
                            required: true,
                            message: '请选择预约服务类型!',
                        },
                    ]}
                >
                    <Select placeholder="请选择服务类型">
                        <Select.Option value="administrativePermit">行政许可</Select.Option>
                        <Select.Option value="administrativeConfirmation">行政确认</Select.Option>
                        <Select.Option value="administrativeDecision">行政裁决</Select.Option>
                        <Select.Option value="administrativePayment">行政给付</Select.Option>
                        <Select.Option value="administrativeReward">行政奖励</Select.Option>
                        <Select.Option value="administrativeRecord">行政备案</Select.Option>
                        <Select.Option value="publicEducation">公共教育</Select.Option>
                        <Select.Option value="employment">劳动就业</Select.Option>
                        <Select.Option value="socialInsurance">社会保险</Select.Option>
                        <Select.Option value="healthCare">医疗卫生</Select.Option>
                        <Select.Option value="elderlyServices">养老服务</Select.Option>
                        <Select.Option value="socialServices">社会服务</Select.Option>
                        <Select.Option value="housingSecurity">住房保障</Select.Option>
                        <Select.Option value="cultureSports">文化体育</Select.Option>
                        <Select.Option value="disabilityServices">残疾人服务</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="预约时间"
                    name="daterange"
                    rules={[
                        {
                            required: true,
                            message: '请选择您的预约时间!',
                        },
                    ]}
                >
                    <ConfigProvider locale={locale}>
                        <Space direction="vertical" size={12}>
                            <RangePicker renderExtraFooter={() => '请选择您的预约时间'} showTime />
                        </Space>
                    </ConfigProvider>
                </Form.Item>

                <Form.Item
                    label="手机号"
                    name="phone"
                    rules={[
                        {
                            required: true,
                            message: '请输入您的手机号!',
                        },
                        { validator: phoneValidator },
                    ]}
                >
                    <Input
                        addonBefore={
                            <Select defaultValue={countryCode} onChange={onCountryCodeChange} style={{ width: 80 }}>
                                <Select.Option value="+86">+86</Select.Option>
                                <Select.Option value="+1">+1</Select.Option>
                                {/* 可根据需要添加其他国家 */}
                            </Select>
                        }
                    />
                </Form.Item>
                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default FormPage;
