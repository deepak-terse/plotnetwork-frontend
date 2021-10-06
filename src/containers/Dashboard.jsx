import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Iframe from 'react-iframe'

import styles from '../styles/Home.module.scss';
import { isMobile } from '../utils/device';

import axios from 'axios';
import { getAPIs } from '../utils/constants';

class Dashboard extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        this.getProjects();
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

    getProjects = () => {
        let params = {
            filter: {
                "partnerName": localStorage.getItem('partner')
            }
        };

        axios({
            method: 'get',
            url: getAPIs().project,
            params: params
        }).then((response) => {
            if (response.status == 200){
                console.log('User fetched', response.data); 
                localStorage.setItem("projects",JSON.stringify(response.data.data));
                
            } else if (response.status == 401) {
                console.log("User not exist");
            } else {
                console.log('Error found : ', response.data.message);
            }
        }).catch((error)=>{
            console.log('Error found : ', error);
        });
    }
}

export default withRouter(Dashboard)

