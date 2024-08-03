import React from "react";
import DashboardComponent from "../../components/Dashboard/DashboardComponent";

class Dashboard extends React.Component {
    componentDidMount() {
        document.title = "大屏";
    }

    render() {
        return(
            <>
            <DashboardComponent/>
            </>
        );
    }

}

export default Dashboard;