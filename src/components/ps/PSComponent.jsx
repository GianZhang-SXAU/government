import React, { useState, useRef, useEffect } from "react";
import { Upload, Button, Select, Row, Col, message } from "antd";
import { UploadOutlined, PrinterOutlined } from "@ant-design/icons";
import "./ps.scss";

const { Option } = Select;

const PSComponent = () => {
    const [imageUrl, setImageUrl] = useState(null);
    const [processedImageUrl, setProcessedImageUrl] = useState(null);
    const [selectedColor, setSelectedColor] = useState("#ffffff");
    const canvasRef = useRef(null);
    // 上传照片后执行抠图的操作

    /*
    * @Author: 张建安
    * @Data: 2024/8/25
    * @param: Promise
    * @return:
    * */
    const handleChange = async (info) => {
        if (info.file.status === "done" || info.file.originFileObj) {
            const file = info.file.originFileObj;
            // 新建文件读取对象
            const reader = new FileReader();
            // 调用removeBackground()方法，将图片转化为Base64格式，然后执行抠图操作
            reader.onload = async (e) => {
                const imageBase64 = e.target.result;
                try {
                    const result = await removeBackground(imageBase64);
                    setImageUrl(result);
                } catch (error) {
                    message.error("抠图失败，请重试。");
                }
            };
            // 返回图片的地址
            reader.readAsDataURL(file);
        }
    };

    /*
     * @Author: 张建安
     * @Data: 2024/8/25
     * @param: Promise
     * @return: URL.createObjectURL(resultBlob); // 返回一个可以用作 <img> src 的 URL
     * */
    // 抠图的方法
    const removeBackground = async (imageBase64) => {
        const apiKey = "sXtVfpE1fwKQPFTeEAMwNNz3"; // API 密钥
        const url = "https://api.remove.bg/v1.0/removebg"; //抠图的请求地址

        const formData = new FormData();
        formData.append("image_file_b64", imageBase64.split(",")[1]);
        formData.append("size", "auto");

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "X-Api-Key": apiKey
                },
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }

            const resultBlob = await response.blob();
            return URL.createObjectURL(resultBlob); // 返回一个可以用作 <img> src 的 URL
        } catch (error) {
            console.error("Error removing background:", error);
            throw error;
        }
    };

    // 利用Hook监听图片地址以及图片颜色的方法
    useEffect(() => {
        if (imageUrl && canvasRef.current) {
            processImage(imageUrl, selectedColor);
        }
    }, [imageUrl, selectedColor]);

    /*
         * @Author: 张建安
         * @Data: 2024/8/25
         * @param: imgSrc, backgroundColor
         * @return:
         * */
    // Canvas的方法，用来加载方法
    const processImage = (imgSrc, backgroundColor) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = imgSrc;

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            setProcessedImageUrl(canvas.toDataURL("image/png"));
        };
    };

    const handleColorChange = (value) => {
        setSelectedColor(value);
    };

    /*
         * @Author: 张建安
         * @Data: 2024/8/25
         * @param:
         * @return:
         * */
    // 打印证件照的方法
    const handlePrint = () => {
        const printArea = document.createElement("div");
        printArea.style.display = "none";
        document.body.appendChild(printArea);

        for (let i = 0; i < 9; i++) {
            const img = document.createElement("img");
            img.src = processedImageUrl;
            img.style.width = "150px";
            img.style.height = "200px";
            img.style.margin = "5px";
            printArea.appendChild(img);
        }

        const printWindow = window.open();
        printWindow.document.write(printArea.innerHTML);
        printWindow.document.close();
        printWindow.print();
        document.body.removeChild(printArea);
    };

    return (
        <div className="ps">
            <Row gutter={16}>
                <Col span={12}>
                    <Upload
                        listType="picture"
                        showUploadList={false}
                        onChange={handleChange}
                        accept="image/*"
                    >
                        <Button icon={<UploadOutlined />}>上传证件照</Button>
                    </Upload>
                </Col>
                <Col span={12}>
                    <Select
                        value={selectedColor}
                        style={{ width: 120 }}
                        onChange={handleColorChange}
                    >
                        <Option value="#ffffff">白色</Option>
                        <Option value="#0000ff">蓝色</Option>
                        <Option value="#ff0000">红色</Option>
                        <Option value="#00ff00">绿色</Option>
                        {/* 添加更多选项 */}
                    </Select>
                </Col>
            </Row>

            {processedImageUrl && (
                <div className="preview-container" style={{ marginTop: 20 }}>
                    <h3>处理后的照片：</h3>
                    <img src={processedImageUrl} alt="Processed" style={{ maxWidth: "100%", marginBottom: "20px" }} />
                    <Button
                        type="primary"
                        icon={<PrinterOutlined />}
                        onClick={handlePrint}
                    >
                        完成并打印
                    </Button>
                </div>
            )}

            <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
    );
};

export default PSComponent;
