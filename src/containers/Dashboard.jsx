import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Iframe from 'react-iframe'

import '../styles/Home.module.scss';

class Dashboard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                {/* <iframe loading="lazy" src={"https://datastudio.google.com/embed/reporting/c4e4103b-cfaa-4787-aa50-0fa34588acf0/page/a2BAC"} width="100%" height="100%" frameborder="0" allowfullscreen=""></iframe> */}
                <Iframe url="https://datastudio.google.com/embed/reporting/c4e4103b-cfaa-4787-aa50-0fa34588acf0/page/a2BAC"
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

