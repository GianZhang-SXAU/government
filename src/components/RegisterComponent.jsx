import React, {useState} from 'react';
import axios from 'axios';
import {Form, Input, Button, Select, Cascader, message, Radio} from 'antd';
import json from '../asserts/pca.json';

const { Option } = Select;

const regionData = json; // Adjust this as per the JSON structure

const RegisterComponent = () => {
    const [form] = Form.useForm();
    const [docType, setDocType] = useState('idCard');

    // 点击提交后，调用Axios请求
    const onFinish = (values) => {
        console.log(values);
        axios.post('/register', values)
            .then(response => {
                message.success('注册成功!');
            })
            .catch(error => {
                message.error('注册失败!');
            });
    };


    // 手机号的正则表达式验证规则
    const phoneValidator = (_, value) => {
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!value || phoneRegex.test(value)) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('请输入正确的电话号码!'));
    };
    // 身份证的正则表达式验证规则
    const idCardValidator = (_, value) => {
        const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/;
        if (!value || idCardRegex.test(value)) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('请输入正确的身份证号!'));
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
        form.resetFields(['idCard']);
    };

    // const regionOptions = regionData.map((province) => ({
    //     value: province.province,
    //     label: province.province,
    //     children: province.cities.map((city) => ({
    //         value: city.city,
    //         label: city.city,
    //         children: city.districts.map((district) => ({
    //             value: district,
    //             label: district,
    //         })),
    //     })),
    // }));

    const regionOptions = Object.keys(regionData).map(province => ({
        value: province,
        label: province,
        children: Object.keys(regionData[province]).map(city => ({
            value: city,
            label: city,
            children: regionData[province][city].map(district => ({
                value: district,
                label: district
            }))
        }))
    }));

    return (
        <Form
            name="registration"
            onFinish={onFinish}
            initialValues={{ prefix: '86' }}
            scrollToFirstError
        >
            <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入您的姓名!' }]}
            >
                <Input placeholder="姓名" />
            </Form.Item>

            <Form.Item
                name="phone"
                label="电话号码"
                rules={[
                    { required: true, message: '请输入您的电话号!' },
                    { validator: phoneValidator },
                ]}
            >
                <Input addonBefore="+86" placeholder="电话号码" />
            </Form.Item>

            <Form.Item label="证件类型" name="docType">
                <Radio.Group onChange={onDocTypeChange} value={docType}>
                    <Radio value="idCard">中国居民身份证</Radio>
                    <Radio value="passport">护照</Radio>
                </Radio.Group>
            </Form.Item>

            {docType === 'idCard' && (
                <Form.Item
                    name="idCard"
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
                    name="idCard"
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
                name="password"
                label="密码"
                rules={[{ required: true, message: '请输入您的密码!' }]}
                hasFeedback
            >
                <Input.Password placeholder="密码" />
            </Form.Item>

            <Form.Item
                name="location"
                label="家庭住址"
                rules={[{ required: true, message: '请输入您的家庭住址!' }]}
            >
                <Input placeholder="家庭住址" />
            </Form.Item>

            <Form.Item
                name="region"
                label="所属地区"
                rules={[{ type: 'array', required: true, message: '请选择您的地区!' }]}
            >
                <Cascader options={regionOptions} placeholder="选择地区" />
            </Form.Item>

            <Form.Item
                name="work"
                label="工作单位"
                rules={[{ required: true, message: '请输入您的工作单位!' }]}
            >
                <Input placeholder="工作单位" />
            </Form.Item>

            <Form.Item
                name="profession"
                label="工作"
                rules={[{ required: true, message: '请输入您的工作!' }]}
            >
                <Input placeholder="工作角色" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Register
                </Button>
            </Form.Item>
        </Form>
    );
};

export default RegisterComponent;
