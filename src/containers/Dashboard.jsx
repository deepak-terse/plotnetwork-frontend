import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Iframe from 'react-iframe'

import styles from '../styles/Home.module.scss';
import { isMobile } from '../utils/device';

class Dashboard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {reportDesktop, reportMobile} = JSON.parse(localStorage.getItem('loggedInUser')).partnerDetails;

        console.log(isMobile);
        const url = isMobile() ? 
            reportMobile :
            reportDesktop
        return (
            <React.Fragment>
                {
                    isMobile() ? 
                    <Iframe url= {url}
                        width="100%"
                        height="100%"
                        id={styles.mobilereport}
                        className="myClassname"
                        display="initial"
                        position="relative"
                        allowfullscreen={true}/>
                    :
                    <Iframe url= {url}
                        width="100%"
                        height="100%"
                        id={styles.desktopreport}
                        className="myClassname"
                        display="initial"
                        position="relative"
                        allowfullscreen={true}/>
                }
                
            </React.Fragment>
        )
    }
}

export default withRouter(Dashboard)

