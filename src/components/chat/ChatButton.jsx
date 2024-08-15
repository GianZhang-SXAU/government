import React, { useState } from 'react';
import { Button, Drawer, Input, List } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import ChatComponent from "./ChatComponent";
import img_path from "../../asserts/img/智能助理.png"

const ChatButton = () => {
    const [visible, setVisible] = useState(false);
    const [messages, setMessages] = useState([]);

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const handleSend = (e) => {
        e.preventDefault();
        const newMessage = e.target.elements.message.value;
        setMessages([...messages, { text: newMessage, sender: 'User' }]);
        e.target.reset();
    };

    return (
        <>
            <Button
                type="primary"
                shape="round"
                style={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
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
                title="智能助理"
                // placement="bottom"
                closable={true}
                onClose={onClose}
                visible={visible}
                width={720}
                // height={400}
            >
                <ChatComponent></ChatComponent>
            </Drawer>
        </>
    );
};

export default ChatButton;
