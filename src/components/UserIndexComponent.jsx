import React, {useState} from "react";
import {useSelector} from "react-redux";
import {Card, Table} from "antd";


const UserIndexComponent = () => {

    const user = useSelector((state) => state.user.data);


    return (
        <div className="site-layout-content" style={{margin: '16px 0'}}>
            <Card>
                <h2>
                    {user
                        ? `欢迎 ${user.name}用户 使用政务服务大厅预约与排队系统`
                        : '欢迎使用政务服务大厅预约与排队系统，请先登录'}
                </h2>
            </Card>

        </div>
    )
}

export default UserIndexComponent