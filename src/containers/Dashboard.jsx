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
        console.log(isMobile);
        const url = isMobile() ? 
            "https://datastudio.google.com/embed/reporting/f16fd757-bd4e-4ddf-81eb-97b29e568d90/page/a2BAC" :
            "https://datastudio.google.com/embed/reporting/48e4bf8a-1b96-4a1f-9911-085f909c9e56/page/a2BAC"
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

