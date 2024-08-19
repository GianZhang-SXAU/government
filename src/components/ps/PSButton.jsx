import React, { useState } from 'react';
import {Button, Drawer, FloatButton, Input, List} from 'antd';

import img_path from "../../asserts/img/我的证件照-证件照.png"
import PSComponent from "./PSComponent";

const PSButton = () => {
    const [visible, setVisible] = useState(false);

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };


    return (
        <>
            <Button
                type="primary"
                shape="round"
                style={{
                    position: 'fixed',
                    bottom: 20,
                    right: 90,
                    zIndex: 1000,
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    backgroundColor: '#1890ff', // Ant Design blue color
                    color: '#fff',
                    textAlign: 'center',
                    lineHeight: '30px',
                    padding: 0,
                }}
                onClick={showDrawer}
            >
                <img src={img_path} alt="智能助理" width={35} height={35} />
            </Button>
            <Drawer
                title="证件照处理"
                // placement="bottom"
                closable={true}
                onClose={onClose}
                visible={visible}
                width={720}
                // height={400}
            >
                <PSComponent/>
            </Drawer>
        </>
    );
};

export default PSButton;