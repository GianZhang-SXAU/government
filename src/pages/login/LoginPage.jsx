// 作者: 张建安
// 代码用途: 该代码实现了一个登录页面，用户可以通过输入用户名和密码登录系统，系统根据用户类型导航到不同的页面。使用了 React, Ant Design, Redux, Axios 等技术栈。

import React, {useState} from 'react';
import {Form, Input, Button, message, Card, ConfigProvider} from 'antd'; // 引入 Ant Design 的组件
import axios from 'axios'; // 用于发送 HTTP 请求
import {useDispatch} from 'react-redux'; // 用于触发 Redux actions
import {setUser} from '../../store/index'; // 导入 Redux action，用于设置用户状态
import {useNavigate} from 'react-router-dom'; // 用于页面导航
import Login, {Banner} from "@react-login-page/page3"; // 引入自定义的登录页面组件和横幅组件
import {ClockCircleOutlined, ContactsTwoTone, createFromIconfontCN} from "@ant-design/icons"; // 引入 Ant Design 的图标
import "./LoginPage.scss"; // 引入自定义的样式文件
import img_path from "../../asserts/梦幻花环.png"
import Particles from "react-particles"; // 引入 Particles 组件
import { loadFull } from "tsparticles"; // 引入 tsparticles 用于配置


// 登录页面组件
const LoginPage = () => {

    const [loading, setLoading] = useState(false); // 管理登录按钮的加载状态
    const dispatch = useDispatch(); // 用于触发 Redux actions
    const navigate = useNavigate(); // 用于页面导航

    // 自定义图标组件
    const IconFont = createFromIconfontCN({
        scriptUrl: '//at.alicdn.com/t/c/font_4644358_3muoypyfl6y.js', // 引入阿里图标库的图标
    });

    const API_URL = "http://localhost:8888"; // 后端 API 的基础 URL

    // 表单提交成功时的处理函数
    const onFinish = async (values) => {
        setLoading(true); // 设置加载状态为 true
        try {
            // 发送登录请求
            const response = await axios.post(`${API_URL}/api/auth/login`, values);
            const data = response.data;
            if (data) {
                const {type, user, admin} = data; // 解构后端返回的数据
                const userData = type === 'user' ? user : admin; // 根据用户类型获取用户数据
                dispatch(setUser({data: userData, type})); // 通过 Redux 存储用户信息
                message.success('登录成功！'); // 显示成功消息
                if (type === 'user') {
                    navigate('/user'); // 如果是普通用户，跳转到用户页面
                } else if (type === 'admin') {
                    navigate('/reserve'); // 如果是管理员，跳转到管理员页面
                }
            } else {
                message.error('登录失败，请检查用户名或密码'); // 显示错误消息
            }
        } catch (error) {
            message.error('登录失败，请检查用户名或密码'); // 捕获异常并显示错误消息
        }
        setLoading(false); // 设置加载状态为 false
    };

    // 粒子配置
    const particlesInit = async (main) => {
        await loadFull(main);
    };

    const particlesOptions = {
        background: {
            color: {
                value: "#ffffff"
            }
        },
        fpsLimit: 60,
        interactivity: {
            events: {
                onClick: {
                    enable: true,
                    mode: "push",
                },
                onHover: {
                    enable: true,
                    mode: "repulse",
                },
                resize: true,
            },
            modes: {
                push: {
                    quantity: 4,
                },
                repulse: {
                    distance: 100,
                    duration: 0.4,
                },
            },
        },
        particles: {
            color: {
                value: "#000000",
            },
            links: {
                color: "#000000",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
            },
            collisions: {
                enable: true,
            },
            move: {
                directions: "none",
                enable: true,
                outModes: {
                    default: "bounce",
                },
                random: false,
                speed: 2,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                    area: 800,
                },
                value: 80,
            },
            opacity: {
                value: 0.5,
            },
            shape: {
                type: "circle",
            },
            size: {
                value: { min: 1, max: 5 },
            },
        },
        detectRetina: true,
    };

    return (
        <>
            {/*<Particles id="tsparticles" init={particlesInit} options={particlesOptions} />*/}
            <div className="LoginPage">
                <div className="left">
                    <img src={img_path} style={{width:400 ,height:400}} alt="logo" />
                </div>
                <div className="right">
                      <h3 className="title">政务服务大厅预约与排队系统</h3>

            <ConfigProvider
                theme={{
                    token: {
                        lineWidth: 2,
                    },
                    components: {
                        Form: {
                            labelHeight: 50,

                        }
                    }
                }}
            >
                <Card title="登录" className="login-card">
                    <Form name="login" onFinish={onFinish} className="loginform">
                        <Form.Item name="username" label="用户名" rules={[{required: true, message: '请输入用户名!'}]}>
                            <Input placeholder="用户名" prefix={<ContactsTwoTone/>}/>
                        </Form.Item>
                        <Form.Item name="password" label="密码" rules={[{required: true, message: '请输入密码!'}]}>
                            <Input.Password placeholder="密码" prefix={
                                <svg t="1722896764451" className="icon"
                                     viewBox="0 0 1024 1024" version="1.1"
                                     xmlns="http://www.w3.org/2000/svg" p-id="1647"
                                     width="20" height="20">
                                    <path
                                        d="M305.110204 495.804082c-10.971429 0-19.853061-8.881633-19.853061-19.853062V341.681633C285.257143 216.816327 387.134694 114.938776 512 114.938776c89.338776 0 170.840816 52.767347 206.889796 134.791836 13.061224 29.257143 19.330612 60.081633 19.330612 91.951021 0 10.971429-8.881633 19.853061-19.853061 19.853061-10.971429 0-19.853061-8.881633-19.853061-19.853061 0-26.122449-5.22449-51.722449-16.195919-75.755102-29.257143-67.918367-96.653061-111.281633-170.318367-111.281633-102.922449 0-187.036735 83.591837-187.036735 187.036735v134.269387c0 10.971429-8.881633 19.853061-19.853061 19.853062z"
                                        fill="#3D2A03" p-id="1648"></path>
                                    <path
                                        d="M762.253061 909.061224H261.746939c-43.885714 0-79.412245-35.526531-79.412245-79.412244v-294.138776c0-43.885714 35.526531-79.412245 79.412245-79.412245H762.77551c43.885714 0 79.412245 35.526531 79.412245 79.412245v294.138776c-0.522449 43.885714-36.04898 79.412245-79.934694 79.412244z"
                                        fill="#F2CB51" p-id="1649"></path>
                                    <path
                                        d="M509.387755 813.453061c-30.82449 0-55.902041-25.077551-55.902041-55.902041v-42.840816c-21.420408-17.240816-33.436735-43.363265-33.436734-71.053061 0-50.677551 41.273469-91.95102 91.95102-91.951021s91.95102 41.273469 91.95102 91.951021c0 30.302041-14.628571 57.991837-38.661224 75.232653v39.183673c0 30.302041-25.077551 55.379592-55.902041 55.379592z"
                                        fill="#E5404F" p-id="1650"></path>
                                </svg>}/>
                        </Form.Item>
                        <Form.Item style={{textAlign:"center"}}>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </ConfigProvider>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
