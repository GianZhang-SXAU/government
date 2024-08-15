import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, List, Typography, Avatar } from 'antd';
import axios from 'axios';

const { Text } = Typography;

const ChatComponent = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);

    // Ref to the end of the message list for auto-scrolling
    const endOfMessagesRef = useRef(null);

    useEffect(() => {
        // 添加欢迎消息
        const welcomeMessage = {
            role: 'assistant',
            content: '欢迎使用政务服务大厅预约与排队系统智能助理系统，请问有什么需要帮助的吗？'
        };
        setMessages([welcomeMessage]);
    }, []);

    useEffect(() => {
        // 自动滚动到最新消息
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]); // 当 messages 更新时触发滚动

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        // 用户消息
        const userMessage = { role: 'user', content: inputValue };

        // 清空输入框
        setInputValue('');

        // 更新消息列表，显示用户消息
        setMessages([...messages, userMessage]);

        // 显示加载中的消息
        setLoading(true);
        const loadingMessage = { role: 'assistant', content: '正在加载中...' };
        setMessages(prevMessages => [...prevMessages, loadingMessage]);

        try {
            // 发送请求到后端
            const response = await axios.post('http://localhost:8888/callSparkModel', { message: inputValue });

            // 处理返回的数据
            const { data } = response;

            if (data.error) {
                // 处理错误响应
                const errorMessage = `API响应失败，请重新发送。错误信息：${data.error.message}`;
                const errorAssistantMessage = {
                    role: 'assistant',
                    content: errorMessage
                };
                setMessages(prevMessages => prevMessages.slice(0, -1).concat(errorAssistantMessage));
            } else {
                // 处理成功响应
                const assistantMessage = {
                    role: 'assistant',
                    content: data.choices[0].message.content
                };
                setMessages(prevMessages => prevMessages.slice(0, -1).concat(assistantMessage));
            }
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = '网络错误，请稍后再试。';
            const errorAssistantMessage = {
                role: 'assistant',
                content: errorMessage
            };
            setMessages(prevMessages => prevMessages.slice(0, -1).concat(errorAssistantMessage));
        } finally {
            // 隐藏加载中的消息
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '87vh' }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '5px', backgroundColor: '#f5f5f5' }}>
                <List
                    dataSource={messages}
                    renderItem={item => (
                        <List.Item
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                marginBottom: '10px',
                                justifyContent: item.role === 'user' ? 'flex-end' : 'flex-start',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {item.role === 'assistant' && item.content !== '正在加载中...' && (
                                    <Avatar
                                        size={30}
                                        style={{
                                            backgroundColor: '#87d068',
                                            marginRight: '8px'
                                        }}
                                    >
                                        AI
                                    </Avatar>
                                )}

                                <div
                                    style={{
                                        backgroundColor: item.role === 'user' ? '#0084ff' : (item.content === '正在加载中...' ? '#f5f5f5' : '#ffffff'),
                                        color: item.role === 'user' ? '#ffffff' : '#000000',
                                        borderRadius: '15px',
                                        padding: '10px',
                                        maxWidth: '80%',
                                        textAlign: 'left',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    }}
                                >
                                    <Text>{item.content}</Text>
                                </div>
                                {item.role === 'user' && (
                                    <Avatar
                                        size={30}
                                        style={{
                                            backgroundColor: '#f56a00',
                                            marginLeft: '8px'
                                        }}
                                    >
                                        U
                                    </Avatar>
                                )}
                            </div>
                        </List.Item>
                    )}
                />
                {/* Ref for auto-scrolling */}
                <div ref={endOfMessagesRef} />
            </div>

            <div style={{
                backgroundColor: '#ffffff',
                padding: '10px',
                boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)',
                borderTop: '1px solid #e8e8e8',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                position: 'relative'
            }}>
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onPressEnter={handleSend}
                    placeholder="向智能助理发送信息"
                    style={{ flex: 1, marginRight: '10px' }}
                />
                <Button
                    type="primary"
                    onClick={handleSend}
                    disabled={loading} // 禁用发送按钮
                >
                    发送
                </Button>
            </div>
        </div>
    );
};

export default ChatComponent;
