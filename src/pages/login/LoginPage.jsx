import React from 'react';
import { Layout } from 'antd';
import LoginForm from '../../components/LoginComponent';
import 'antd/dist/reset.css';
import {Footer} from "antd/es/modal/shared";
import {Content, Header} from "antd/es/layout/layout";

const LoginPage = () => {
    return (
        <Layout className="layout">
            <Header>
                <div className="logo" />
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
    );
}

export default LoginPage;