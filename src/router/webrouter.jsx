import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Index from "../pages/index/IndexPage";
import FormPage from "../pages/form/Form";
import ReservePage from "../pages/system/ReservePage";
import LoginPage from "../pages/login/LoginPage";
import RegisterPage from "../pages/login/RegisterPage";
import UserIndex from "../pages/index/UserIndex";
import {Provider} from "react-redux";
import store from "../store/index";


const AppRouter = () => {
    return (
        <Provider store={store}>
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/index" element={<Index />} />
                <Route path="/form" element={<FormPage />} />
                <Route path="/reserve" element={<ReservePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/user" element={<UserIndex />} />
            </Routes>
        </Router>
        </Provider>
    );
};

export default AppRouter;