import React, {useState} from 'react';
import {Layout, Menu, Breadcrumb} from 'antd';
import { UserOutlined, ScheduleOutlined, TeamOutlined, FormOutlined, HomeOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';

import FormPage from "../form/Form";
import IndexComponent from "../../components/IndexComponent";
import ServiceManagement from "../../components/ServiceManagementComponent";
import AdminLoginComponent from "../../components/admin/AdminLoginComponent";
import WindowManagement from "../../components/windows/WindowManagementComponent";
import AdminRegisterComponent from "../../components/admin/AdminRegisterComponent";
import ManageAppointments from "../../components/appointments/ManageAppointments";
import CreateAppointment from "../../components/appointments/CreateAppointment";
import QueueManagement from "../../components/queue/QueueComponent";
import InformationManager from "../../components/information/InformationManager";
import "./ReservePage.scss"
import CommentManagement from "../../components/commit/CommentManagement";
import Information from "../../components/information/Information";
import {useSelector} from "react-redux";
const { Header, Content, Footer, Sider } = Layout;
// eslint-disable-next-line react-hooks/rules-of-hooks
// const [userInfo, setUserInfo] = useState(null);


// 组件定义
const HomePage = () => <div><IndexComponent/></div>;
const QuickReservePage = () => <div><CreateAppointment/></div>;
const UserPage = () => <div><Information/></div>
const UserProfilePage = () => <div><InformationManager/></div>;
const ViewReservationPage = () => <div><ManageAppointments/></div>;
const ViewQueuePage = () => <div><QueueManagement/></div>;
const ManageServicesPage = () => <div><ServiceManagement/></div>;
const ServiceFeedbackPage = () => <div><CommentManagement/></div>;
const WindowsPage = () => <div><WindowManagement/></div>;

// userInfo = JSON.parse(localStorage.getItem('userInfo'));

// const logout = () => {
//     localStorage.removeItem('userInfo');
//     setUserInfo(null);
//     message.success('已退出登录');
//
// };



class ReservePage extends React.Component {

    componentDidMount() {
        document.title = "欢迎使用管理端";
    }


    state = {
        contentTitle: '首页',
        ContentComponent: HomePage,
        breadcrumbItems: [
            { title: '首页', icon: <HomeOutlined /> }
        ]
    };

    // 将菜单键映射到组件和标题
    topMenuMapping = {
        '1': { title: '首页', component: HomePage, icon: <HomeOutlined /> },
        '2': { title: '快捷预约', component: QuickReservePage, icon: <AppstoreOutlined /> },
        '3': { title: '个人中心', component: UserPage, icon: <UserOutlined /> },
    };

    sideMenuMapping = {
        '1': { title: '个人信息修改', component: UserProfilePage, icon: <UserOutlined /> },
        '2': { title: '预约信息查看', component: ViewReservationPage, icon: <ScheduleOutlined /> },
        '3': { title: '排队信息查看', component: ViewQueuePage, icon: <TeamOutlined /> },
        '4': { title: '政务服务管理', component: ManageServicesPage, icon: <FormOutlined /> },
        '5': { title: '服务评价管理', component: ServiceFeedbackPage, icon: <FormOutlined /> },
        '6': { title: '服务窗口管理', component: WindowsPage, icon: <FormOutlined /> },
    };

    handleTopMenuClick = (e) => {
        const { title, component, icon } = this.topMenuMapping[e.key];
        this.setState({
            contentTitle: title,
            ContentComponent: component,
            breadcrumbItems: [
                { title: '首页', icon: <HomeOutlined /> },
                { title, icon }
            ]
        });
    };

    handleSideMenuClick = (e) => {
        const { title, component, icon } = this.sideMenuMapping[e.key];
        this.setState({
            contentTitle: title,
            ContentComponent: component,
            breadcrumbItems: [
                { title: '首页', icon: <HomeOutlined /> },
                { title, icon }
            ]
        });
    };

    render() {
        const { contentTitle, ContentComponent, breadcrumbItems } = this.state;

        return(
            <>
                <Layout style={{ minHeight: '100vh' }}>
                    <Header className="header"
                            style={{padding: 0, background: '#fff', display: 'flex', justifyContent: 'space-between'}}>
                        <div className="logo" style={{marginLeft: '16px', fontWeight: 'bold', fontSize: '20px'}}>
                            政务服务中心预约与排队系统
                        </div>
                        {/*{userInfo && (*/}
                        {/*    <Menu.Item key="1" onClick={logout}>*/}
                        {/*        欢迎{userInfo}*/}
                        {/*    </Menu.Item>*/}
                        {/*)}*/}
                        <Menu
                            theme="light"
                            mode="horizontal"
                            defaultSelectedKeys={['1']}
                            style={{flex: 1, justifyContent: 'center'}}
                            onClick={this.handleTopMenuClick}
                        >
                            <Menu.Item key="1">首页</Menu.Item>
                            <Menu.Item key="2">快捷预约</Menu.Item>
                            <Menu.Item key="3">个人中心</Menu.Item>
                        </Menu>
                    </Header>
                    <Layout>
                        <Sider width={200} className="site-layout-background">
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={['1']}
                                style={{ height: '100%', borderRight: 0 }}
                                onClick={this.handleSideMenuClick}
                            >
                                <Menu.Item key="1" icon={<UserOutlined />}>个人信息修改</Menu.Item>
                                <Menu.Item key="2" icon={<ScheduleOutlined />}>预约信息查看</Menu.Item>
                                <Menu.Item key="3" icon={<TeamOutlined />}>排队信息查看</Menu.Item>
                                <Menu.Item key="4" icon={<FormOutlined />}>政务服务管理</Menu.Item>
                                <Menu.Item key="5" icon={<FormOutlined />}>服务评价管理</Menu.Item>
                                <Menu.Item key="6" icon={<FormOutlined />}>服务窗口管理</Menu.Item>
                            </Menu>
                        </Sider>
                        <Layout style={{ padding: '0 24px 24px' }}>
                            <Breadcrumb style={{ margin: '16px 0' }}>
                                {breadcrumbItems.map((item, index) => (
                                    <Breadcrumb.Item key={index}>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </Breadcrumb.Item>
                                ))}
                            </Breadcrumb>
                            <Content
                                style={{
                                    padding: 24,
                                    margin: 0,
                                    minHeight: 280,
                                    background: '#fff'
                                }}
                            >
                                <ContentComponent />
                            </Content>
                            <Footer style={{ textAlign: 'center' }}>
                                山西农业大学软件学院 张建安 © 2024 政务服务大厅预约与排队系统. All rights reserved.
                            </Footer>
                        </Layout>
                    </Layout>
                </Layout>
            </>
        );
    }
}

export default ReservePage;
