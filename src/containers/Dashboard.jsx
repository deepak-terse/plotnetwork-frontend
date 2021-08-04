import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Iframe from 'react-iframe'

import '../styles/Home.module.scss';
import { isMobile } from '../utils/device';

class Dashboard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(isMobile);
        const url = isMobile() ? 
            "https://datastudio.google.com/embed/reporting/f16fd757-bd4e-4ddf-81eb-97b29e568d90/page/a2BAC" :
            "https://datastudio.google.com/embed/reporting/c4e4103b-cfaa-4787-aa50-0fa34588acf0/page/a2BAC"
        return (
            <React.Fragment>
                <Iframe url= {url}
                    width="100%"
                    height="100%"
                    id="myId"
                    className="myClassname"
                    display="initial"
                    position="relative"
                    allowfullscreen=""/>
            </React.Fragment>
        )
    }
}

export default withRouter(Dashboard)

