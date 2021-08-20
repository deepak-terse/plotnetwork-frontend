import React, { Component } from 'react';

// import { Trans } from 'react-i18next';
class Footer extends Component {
  render () {
    return (
      <footer className="footer">
        <div className="container-fluid">
          <div className="d-sm-flex justify-content-center align-items-center justify-content-sm-between py-2 w-100">
            {/* <span className="text-muted text-center text-sm-left d-block d-sm-inline-block">Copyright © <a href="https://vcraftlabs.com/" target="_blank" rel="noopener noreferrer">plotnetwork </a>2021</span> */}
            <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">Powered by {" "}
              <a href="https://vcraftlabs.com/" target="_blank" rel="noopener noreferrer"> 
                &nbsp;<h3 style={{display:'inline'}}>Plot Network</h3>
              </a>   
            </span>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;