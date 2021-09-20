import React, { Component } from 'react';
import { RouteComponentProps, Link, withRouter } from 'react-router-dom';
import { Collapse, Dropdown } from 'react-bootstrap';
import { Trans } from 'react-i18next';

import logo from '../assets/images/logo_long.png';
import logomini from '../assets/images/logo_short.png';

class Sidebar extends Component {

    state = {};

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.onRouteChanged();
        }
    }

    onRouteChanged() {
        document.querySelector('#sidebar')?.classList.remove('active');
        Object.keys(this.state).forEach(i => {
            this.setState({[i]: false});
        });
    }

  render () {
    const partner = localStorage.getItem('partner');
    const userType = JSON.parse(localStorage.getItem('loggedInUser')).userType;
    const { logoLong, logoShort } = JSON.parse(localStorage.getItem('loggedInUser')).partnerDetails;

    return (
      <nav className="sidebar sidebar-offcanvas" id="sidebar">
        <div style={{"text-align":"center"}} className="sidebar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center fixed-top">
          <a className="sidebar-brand brand-logo" href="index.html"><img src={logoLong} alt="logo" /></a>
          <a className="sidebar-brand brand-logo-mini" href="index.html"><img src={logoShort} alt="logo" /></a>
        </div>
        <ul className="nav">
          <li className="nav-item nav-category">
            <span className="nav-link"><Trans>Quick Access</Trans></span>
          </li>
          {
            userType === "admin"? 
            <li className={ this.isPathActive('/' + partner + '/dashboard') ? 'nav-item menu-items active' : 'nav-item menu-items' }>
              <Link className="nav-link" to={"/" + partner + "/dashboard"}>
                <span className="menu-icon"><i className="mdi mdi-speedometer"></i></span>
                <span className="menu-title"><Trans>Dashboard</Trans></span>
              </Link>
            </li> :
            ""
          }
          <li className={ this.isPathActive('/' + partner + '/leads') ? 'nav-item menu-items active' : 'nav-item menu-items' }>
            <Link className="nav-link" to={"/" + partner + "/leads"}>
              <span className="menu-icon"><i className="mdi mdi-account-multiple"></i></span>
              <span className="menu-title"><Trans>Leads</Trans></span>
            </Link>
          </li>
          <li className="nav-item nav-category">
            <span className="nav-link"><Trans>Setup</Trans></span>
          </li>
          <li className={ this.isPathActive('/' + partner + '/brokers') ? 'nav-item menu-items active' : 'nav-item menu-items' }>
            <Link className="nav-link" to={"/" + partner + "/brokers"}>
              <span className="menu-icon"><i className="mdi mdi-account-multiple"></i></span>
              <span className="menu-title"><Trans>Brokers</Trans></span>
            </Link>
          </li>
          {
            userType === "admin"? 
            <li className={ this.isPathActive('/' + partner + '/salesteam') ? 'nav-item menu-items active' : 'nav-item menu-items' }>
              <Link className="nav-link" to={"/" + partner + "/salesteam"}>
                <span className="menu-icon"><i className="mdi mdi-account-multiple"></i></span>
                <span className="menu-title"><Trans>Sales Team</Trans></span>
              </Link>
            </li> :
            ""
          }
          {
            userType === "admin"? 
            <li className={ this.isPathActive('/' + partner + '/projects') ? 'nav-item menu-items active' : 'nav-item menu-items' }>
              <Link className="nav-link" to={"/" + partner + "/projects"}>
                <span className="menu-icon"><i className="mdi mdi-account-multiple"></i></span>
                <span className="menu-title"><Trans>Projects</Trans></span>
              </Link>
            </li> :
            ""
          }
        </ul>
      </nav>
    );
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }

  componentDidMount() {
    this.onRouteChanged();
    // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    const body = document.querySelector('body');
    document.querySelectorAll('.sidebar .nav-item').forEach((el) => {
      
      el.addEventListener('mouseover', function() {
        if(body?.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function() {
        if(body?.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });
  }

}

export default withRouter(Sidebar);