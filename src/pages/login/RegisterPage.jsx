import React, {Component} from "react";
import RegisterComponent from "../../components/RegisterComponent";
import {Content, Header ,Footer} from "antd/es/layout/layout";
import {ConfigProvider, Layout} from "antd";
import './RegisterPage.scss'


class RegisterPage extends Component {
    componentDidMount() {
        document.title = "注册";
    }

    render() {
        return(
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
                    <Layout>
                        <Header>
                            <div className="header-content">
                                政务服务大厅预约与排队系统注册界面
                            </div>
                        </Header>
                        <Content>
                              <RegisterComponent/>
                        </Content>
                        <Footer>
                            <div className="footer-content">
                                山西农业大学软件学院 张建安 © 2024 政务服务大厅预约与排队系统. All rights reserved.
                            </div>
                        </Footer>
                    </Layout>
                </ConfigProvider>
            </>
        );
    }
}

export default RegisterPage;