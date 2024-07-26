import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
// 验证码方法（需启动Redis）
const CaptchaInput = () => {
    const [uuid, setUuid] = useState('');
    const [captchaUrl, setCaptchaUrl] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');

    const generateCaptcha = () => {
        const newUuid = Math.random().toString(36).substring(2, 15);
        setUuid(newUuid);
        setCaptchaUrl(`http://127.0.0.1:8888/captcha?uuid=${newUuid}`);
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    // const handleVerify = async () => {
    //     try {
    //         const response = await axios.get('http://127.0.0.1:8888/verifyCaptcha', {
    //             params: {
    //                 uuid,
    //                 code: captchaInput
    //             }
    //         });
    //         if (response.data) {
    //             message.success('Captcha verified successfully');
    //             generateCaptcha(); // Generate a new captcha after successful verification
    //             setCaptchaInput(''); // Clear the input
    //         } else {
    //             message.error('Captcha verification failed');
    //             generateCaptcha(); // Refresh captcha if verification fails
    //         }
    //     } catch (error) {
    //         message.error('Error verifying captcha');
    //         generateCaptcha(); // Refresh captcha on error
    //     }
    // };

    return (
        <div>
            <div style={{marginTop: '10px'}}>
                <Input
                    placeholder="请输入验证码"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    style={{width: '200px', marginRight: '10px'}}
                />
                {captchaUrl &&
                    <img src={captchaUrl} alt="验证码加载失败" onClick={generateCaptcha} style={{cursor: 'pointer',width:"100px",height:"50px"}}/>}

            </div>
             </div>
    );
};

export default CaptchaInput;
