import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import '../styles/Login.module.scss';

import logo from '../assets/images/logo_long.png';

class Login extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <div className="container-scroller">
                    <div className="container-fluid page-body-wrapper full-page-wrapper">
                        <div className="main-panel">
                            <div className="content-wrapper">
                                <div className="d-flex align-items-center auth px-0">
                                    <div className="row w-100 mx-0">
                                        <div className="col-lg-3 mx-auto">
                                            <div className="card text-left py-5 px-4 px-sm-5">
                                                <div className="brand-logo">
                                                    <img src={logo} alt="logo" />
                                                </div>
                                                <Form className="pt-3">
                                                    <Form.Group className="d-flex search-field">
                                                        <Form.Control type="email" placeholder="Username" size="lg" className="h-auto" />
                                                    </Form.Group>
                                                    <Form.Group className="d-flex search-field">
                                                        <Form.Control type="password" placeholder="Password" size="lg" className="h-auto" />
                                                    </Form.Group>
                                                    <div className="mt-3">
                                                        <Link className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" to="/dashboard">SIGN IN</Link>
                                                    </div>
                                                    <div className="my-2 d-flex justify-content-between align-items-center">
                                                        <div className="form-check">
                                                            <label className="form-check-label text-muted">
                                                                <input type="checkbox" className="form-check-input"/>
                                                                <i className="input-helper"></i>
                                                                Keep me signed in
                                                            </label>
                                                        </div>
                                                        <a href="!#" onClick={event => event.preventDefault()} className="auth-link text-muted">Forgot password?</a>
                                                    </div>
                                                </Form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default withRouter(Login)
