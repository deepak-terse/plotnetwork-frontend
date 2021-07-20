import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import '../styles/Login.module.scss';

class Login extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                LOGIN
            </React.Fragment>
        )
    }
}

export default withRouter(Login)
