import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import '../styles/Home.module.scss';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { withTranslation } from "react-i18next";
import { HomeRoutes } from '../Routes';

import '../App.scss';
import "../utils/i18n";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFullPageLayout: false
        }
        
    }

    componentDidMount(){
        this.onRouteChanged();
    }

    render() {
        let navbarComponent = !this.state.isFullPageLayout ? <Navbar/> : '';
        let sidebarComponent = !this.state.isFullPageLayout ? <Sidebar/> : '';
        let footerComponent = !this.state.isFullPageLayout ? <Footer/> : '';

        return (
            <div className="container-scroller">
                { sidebarComponent }
                <div className="container-fluid page-body-wrapper">
                    { navbarComponent }
                    <div className="main-panel">
                        <div className="content-wrapper">
                            <HomeRoutes/>
                        </div>
                    { footerComponent }
                    </div>
                </div>
            </div>
        );
    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.onRouteChanged();
        }
    }
    
    onRouteChanged() {
        const { i18n } = this.props;
        const body = document.querySelector('body');
        if(this.props.location.pathname === '/layout/RtlLayout') {
            body?.classList.add('rtl');
            i18n.changeLanguage('ar');
        }
        else {
            body?.classList.remove('rtl')
            i18n.changeLanguage('en');
        }
        window.scrollTo(0, 0);
        const fullPageLayoutRoutes = ['/user-pages/login-1', '/user-pages/login-2', '/user-pages/register-1', '/user-pages/register-2', '/user-pages/lockscreen', '/error-pages/error-404', '/error-pages/error-500', '/general-pages/landing-page'];
        for ( let i = 0; i < fullPageLayoutRoutes.length; i++ ) {
            if (this.props.location.pathname === fullPageLayoutRoutes[i]) {
                this.setState({
                    isFullPageLayout: true
                })
                document.querySelector('.page-body-wrapper')?.classList.add('full-page-wrapper');
                break;
            } else {
                this.setState({
                    isFullPageLayout: false
                })
                document.querySelector('.page-body-wrapper')?.classList.remove('full-page-wrapper');
            }
        }
    }
}

// export default Home
export default withTranslation()(withRouter(Home));
