import React from 'react';
import {Card} from "antd";
import {useSelector} from "react-redux";


const InformationManager = () => {
    const user = useSelector((state) => state.user.data);
    const userType = useSelector((state) => state.user.type);

    if (!user) {
        return <div>未登录</div>;
    }

    return (
        <Card title={userType === 'user' ? "用户信息" : "管理员信息"}>
            <p><strong>用户名:</strong> {user.name || user.username}</p>
            <p><strong>电话:</strong> {user.phone}</p>
            {userType === 'user' && (
                <>
                    <p><strong>身份证号:</strong> {user.idcard}</p>
                    <p><strong>所在地区:</strong> {user.location}</p>
                    <p><strong>县:</strong> {user.city}</p>
                    <p><strong>市:</strong> {user.district}</p>
                    <p><strong>省:</strong> {user.province}</p>
                    <p><strong>工作单位:</strong> {user.work}</p>
                    <p><strong>身份:</strong> {user.profession}</p>
                </>
            )}
            {userType === 'admin' && (
                <>
                    <p><strong>邮箱:</strong> {user.email}</p>
                </>
            )}
        </Card>
    );
};

export default InformationManager;