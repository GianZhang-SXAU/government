// src/components/UserIndex.js
import React from 'react';
import {Button} from "antd";
import {useSelector} from "react-redux";
import NumberComponent from "../../components/TakeANumber/NumberComponent";

const UserIndex = () => {

    const user = useSelector((state) => state.user.data);


    return(
        <>
            {/*欢迎{user.name}使用政务服务大厅用户取号界面*/}
            <NumberComponent />
        </>
    )
};

export default UserIndex;
