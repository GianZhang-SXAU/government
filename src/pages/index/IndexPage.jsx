import React from 'react';
import './index.scss';
import {Button, ConfigProvider, Layout, Space} from 'antd';
import { Link } from "react-router-dom";

const { Header, Footer, Content } = Layout;

class Index extends React.Component {
    componentDidMount() {
        document.title = '政务服务大厅预约与排队系统';
    }

    render() {
        return (
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
            <Layout>
                <Header>
                    <div className="header-content">
                        政务服务大厅预约与排队系统
                    </div>
                </Header>
                <Content>
                    <div className="link-buttom">
                        <Space
                            direction="vertical"
                            size="middle"
                            style={{
                                display: 'flex',
                            }}
                        >
                        <Button block size="large">
                            <Link to="/form">现场快捷预约</Link>
                        </Button>
                        <Button block size="large">
                            <Link to="/reserve">进入预约系统</Link>
                        </Button>
                        <Button block size="large">
                            <Link to="/login">登录</Link>
                        </Button>
                        </Space>
                    </div>

                </Content>
                <Footer>
                    <div className="footer-content">
                      山西农业大学软件学院 张建安 © 2024 政务服务大厅预约与排队系统. All rights reserved.
                    </div>
                </Footer>
            </Layout>
            </ConfigProvider>
        );
    }
}

export default Index;
