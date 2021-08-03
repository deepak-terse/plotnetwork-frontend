import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import '../styles/Login.module.scss';
import axios from 'axios';
import { getAPIs } from '../utils/constants';

import logo from '../assets/images/logo_long.png';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: ''
        }
    }

    onChangeHandler = (event) => {
        const inputData = {}
        inputData[event.target.name] = event.target.value;

        this.setState(inputData);
    }

    render() {
        const { username, password } = this.state;
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
                                                        <Form.Control name="username" type="email" value={username} onChange={this.onChangeHandler} placeholder="Username" size="lg" className="h-auto" />
                                                    </Form.Group>
                                                    <Form.Group className="d-flex search-field">
                                                        <Form.Control name="password" type="password" value={password} onChange={this.onChangeHandler} placeholder="Password" size="lg" className="h-auto" />
                                                    </Form.Group>
                                                    <div className="mt-3">
                                                        <Link onClick={this.login} className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" to="/dashboard">SIGN IN</Link>
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

    login = () => {
        axios({
            method: 'post',
            url: getAPIs().login,
            data: {
                username: this.state.username,
                password: this.state.password
            }
        }).then((response) => {
            console.log(response);
            if (response.status == 200){
                console.log('loggedInUser');
                localStorage.setItem('loggedInUser', response.data.data);
            } else if (response.status == 401) {
                console.log("The entered credentials did not matched");
            } else {
                console.log('Error found : ', response.data.message);
            }
        }).catch((error)=>{
            console.log('Error found : ', error);
        });
    }
}

export default withRouter(Login)
