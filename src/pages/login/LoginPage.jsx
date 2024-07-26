import React from 'react';
import {ConfigProvider, Layout} from 'antd';
import LoginForm from '../../components/LoginComponent';
import 'antd/dist/reset.css';
import logo from '../../asserts/logo.png';
import {Content, Header,Footer} from "antd/es/layout/layout";
import './RegisterPage.scss'

const LoginPage = () => {
    return (
        <>
            <ConfigProvider
                theme={{
                    components: {
                        Layout: {
                            headerColor: '#ffffff',
                            headerBg: '#fd0000',
                            footerBg: '#000000'
                        },
                        Button: {
                            colorPrimary: '#00b96b',
                            algorithm: true, // 启用算法
                        },
                        Input: {
                            colorPrimary: '#eb2f96',
                            algorithm: true, // 启用算法
                        }
                    },
                }}
            >
        <Layout className="layout">
            <Header>
                <div className="logo" >
                    <img src={logo} alt="logo" style={{ width: '100px', height: '50px' }} />
                    登录
                </div>
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <div className="site-layout-content">
                    <LoginForm />
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                政务服务大厅 ©2024
            </Footer>
        </Layout>
            </ConfigProvider>
        </>
    );
}

export default LoginPage;