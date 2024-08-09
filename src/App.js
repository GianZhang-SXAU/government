import './App.css';
import AppRouter from "./router/webrouter";
import {Watermark} from "antd";
import ChatButton from "./components/chat/ChatButton";



function App() {
  return (
      //                        _oo0oo_
      //                       o8888888o
      //                       88" . "88
      //                       (| -_- |)
      //                      0\\  =  //0
      //                     ___/`---'\\___
      //                   .' \\\\|     |// '.
      //                 // \\\\|||  :  |||// \\
      //                //  _|||||  -:- |||||-  \\
      //                |   | \\\\\\  -  /// |   |
      //                | \\_|  ''\\---/''  |_/  |
      //                \\  .-\\__  '-'  ___/-. /
      //              ___'. .'  /--.--\\  `. .'___
      //           ."" '<  `.___\\_<|>_/___.' >' "".
      //          | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |
      //          \\  \\ `_.   \\_ __\\ /__ _/   .-` /  /
      //      =====`-.____`.___ \\_____/___.-`___.-'=====
      //                        `=---='
      //       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      //                 佛祖保佑       永无BUG
      // */
    <div className="App">
        <Watermark content={['政务大厅预约与排队系统', '山西农业大学 张建安 20211613612']}>
            <AppRouter/>
            <ChatButton/>
        </Watermark>
    </div>
  );
}

export default App;
