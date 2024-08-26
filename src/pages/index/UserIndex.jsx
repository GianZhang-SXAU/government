import React from 'react';
import {Breadcrumb, Button, Layout, Menu} from "antd";
import {useSelector} from "react-redux";
import {AppstoreOutlined, FormOutlined, HomeOutlined, ScheduleOutlined, TeamOutlined, UserOutlined} from "@ant-design/icons";
import IndexComponent from "../../components/IndexComponent";
import CreateAppointment from "../../components/appointments/CreateAppointment";
import Information from "../../components/information/Information";
import InformationManager from "../../components/information/InformationManager";
import ManageAppointments from "../../components/appointments/ManageAppointments";
import NumberComponent from "../../components/TakeANumber/NumberComponent";
import UserIndexComponent from "../../components/UserIndexComponent";

const { Header, Content, Footer, Sider } = Layout;

/*
* @Author: 张建安
* @Data: 2024/8/26
* @Description：用户首页
* */


// 组件定义
const HomePage = () => <div><UserIndexComponent/></div>;
const QuickReservePage = () => <div><CreateAppointment/></div>;
const UserPage = () => <div><Information/></div>
const UserProfilePage = () => <div><InformationManager/></div>;
const QueuePage = () => <div><NumberComponent/></div>;
const AppiontmentPage = () => <div>预约查询与修改</div>;
const CommentPage = () => <div>留言评论</div>

export class UserIndex extends React.Component {
    componentDidMount() {
        document.title= "欢迎来到用户端"
    };

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
        '2': { title: '现场排队叫号', component: QueuePage, icon: <ScheduleOutlined /> },
        '3': { title: '预约查询与修改', component: AppiontmentPage, icon: <FormOutlined /> },
        '4': { title: '留言评论', component: CommentPage, icon: <ScheduleOutlined /> },
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

        return (
            <>
                <Layout style={{ minHeight: '100vh' }}>
                    <Header className="header"
                            style={{padding: 0, background: '#fff', display: 'flex', justifyContent: 'space-between'}}>
                        <div className="logo" style={{marginLeft: '16px', fontWeight: 'bold', fontSize: '20px' }}>
                            政务服务中心预约与排队系统用户端
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
                                <Menu.Item key="2" icon={<ScheduleOutlined />}>现场排队叫号</Menu.Item>
                                <Menu.Item key="3" icon={<FormOutlined />}>预约查询与修改</Menu.Item>
                                <Menu.Item key="4" icon={<ScheduleOutlined />}>留言评论</Menu.Item>
                            </Menu>
                        </Sider>

                        {/*页面切换的面包屑*/}
                        <Layout style={{ padding: '0 24px 24px' }}>
                            <Breadcrumb style={{ margin: '16px 0' }}>
                                {breadcrumbItems.map((item, index) => (
                                    <Breadcrumb.Item key={index}>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </Breadcrumb.Item>
                                ))}
                            </Breadcrumb>
                            {/*正文内容*/}
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
        )
    }
}


export default UserIndex;
