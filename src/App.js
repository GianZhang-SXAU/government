import './App.css';
import AppRouter from "./router/webrouter";
import {Watermark} from "antd";



function App() {
  return (
    <div className="App">
        <Watermark content={['Ant Design', '山西农业大学 张建安 20211613612']}>
     <AppRouter/>
        </Watermark>
    </div>
  );
}

export default App;
