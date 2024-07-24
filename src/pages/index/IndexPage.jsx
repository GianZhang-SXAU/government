import React from 'react';
import './index.scss'
import { Button } from 'antd';
import {Link} from "react-router-dom";

class Index extends React.Component {
    componentDidMount() {
        document.title = '政务服务大厅预约与排队系统';
    }

    render() {
       return(
           <>
               <div className="linkbuttom">
                       <Button block size="large">
                           <Link to="/form">现场快捷预约</Link>
                       </Button>
                       <Button block size="large">
                           <Link to="/reserve">进入预约系统</Link>
                       </Button>
                   <Button block size="large">
                       <Link to="/login">登录</Link>
                   </Button>
               </div>
           </>

       );
    }
}

export default Index;
