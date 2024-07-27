import React, {useState} from 'react';
import {Layout, Menu, message} from 'antd';
import { UserOutlined, ScheduleOutlined, TeamOutlined, FormOutlined } from '@ant-design/icons';
import FormPage from "../form/Form";
import IndexComponent from "../../components/IndexComponent";
import ServiceManagement from "../../components/ServiceManagementComponent";
import AdminLoginComponent from "../../components/admin/AdminLoginComponent";
import WindowManagement from "../../components/windows/WindowManagementComponent";

const { Header, Content, Footer, Sider } = Layout;
// eslint-disable-next-line react-hooks/rules-of-hooks
// const [userInfo, setUserInfo] = useState(null);
// Placeholder Components
const HomePage = () => <div><IndexComponent/></div>;
const QuickReservePage = () => <div><FormPage/></div>;
const UserProfilePage = () => <div><AdminLoginComponent/></div>;
const ViewReservationPage = () => <div>预约信息查看内容</div>;
const ViewQueuePage = () => <div>排队信息查看内容</div>;
const EditReservationPage = () => <div>预约信息修改内容</div>;
const ManageServicesPage = () => <div><ServiceManagement/></div>;
const ServiceFeedbackPage = () => <div>服务评价内容</div>;
const WindowsPage = () => <div>窗口服务管理<WindowManagement/></div>;

// userInfo = JSON.parse(localStorage.getItem('userInfo'));

// const logout = () => {
//     localStorage.removeItem('userInfo');
//     setUserInfo(null);
//     message.success('已退出登录');
//
// };


class ReservePage extends React.Component {
    state = {
        contentTitle: '首页',
        ContentComponent: HomePage
    };

    // 将菜单键映射到组件和标题
    topMenuMapping = {
        '1': { title: '首页', component: HomePage },
        '2': { title: '快捷预约', component: QuickReservePage },
        '3': { title: '个人中心', component: UserProfilePage },
    };

    sideMenuMapping = {
        '1': { title: '个人信息修改', component: UserProfilePage },
        '2': { title: '预约信息查看', component: ViewReservationPage },
        '3': { title: '排队信息查看', component: ViewQueuePage },
        '4': { title: '预约信息修改', component: EditReservationPage },
        '5': { title: '政务服务管理', component: ManageServicesPage },
        '6': { title: '服务评价', component: ServiceFeedbackPage },
        '7': { title: '服务评价', component: WindowsPage },
    };

    handleTopMenuClick = (e) => {
        const { title, component } = this.topMenuMapping[e.key];
        this.setState({ contentTitle: title, ContentComponent: component });
    };

    handleSideMenuClick = (e) => {
        const { title, component } = this.sideMenuMapping[e.key];
        this.setState({ contentTitle: title, ContentComponent: component });
    };

    render() {
        const { contentTitle, ContentComponent } = this.state;

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
                                <Menu.Item key="4" icon={<FormOutlined />}>预约信息修改</Menu.Item>
                                <Menu.Item key="5" icon={<FormOutlined />}>政务服务管理</Menu.Item>
                                <Menu.Item key="6" icon={<FormOutlined />}>服务评价</Menu.Item>
                                <Menu.Item key="7" icon={<FormOutlined />}>窗口管理</Menu.Item>
                            </Menu>
                        </Sider>
                        <Layout style={{ padding: '0 24px 24px' }}>
                            <Content
                                style={{
                                    padding: 24,
                                    margin: 0,
                                    minHeight: 280,
                                    background: '#fff'
                                }}
                            >
                                <h1>{contentTitle}</h1>
                                <ContentComponent />
                            </Content>
                            <Footer style={{ textAlign: 'center' }}>
                                张建安 2024
                            </Footer>
                        </Layout>
                    </Layout>
                </Layout>
            </>
        );
    }
}

export default ReservePage;
