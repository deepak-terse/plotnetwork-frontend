import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import '../styles/Home.module.scss';
import { getAllLeads } from '../utils/gsheet_utils';

class Leads extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leads: getAllLeads()
        }
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$ ", getAllLeads());
    }

    render() {
        const { leads } = this.state; 
        const statusClass = {
            "OPEN": "badge badge-success",
            "CLOSE": "badge badge-danger",
            "ON HOLD": "badge badge-info"
        }
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-lg-12 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">All Leads</h4>
                                {/* <p className="card-description"> Add className <code>.table-striped</code></p> */}
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th> Date </th>
                                                <th> Broker Name </th>
                                                <th> Lead Name </th>
                                                <th> Lead Phone Number </th>
                                                <th> Lead Email Address </th>
                                                <th> Sales Manager </th>
                                                <th> Message </th>
                                                <th> Virtual Meet Time </th>
                                                <th> Status </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(
                                                leads.reverse().map((lead, index) => 
                                                    <tr key={index}>
                                                        <td> {lead["date"]} </td>
                                                        <td> {lead["Broker_Name"]} </td>
                                                        <td> {lead["Lead-Name"]} </td>
                                                        <th> {lead["Lead-Phone-Number"]} </th>
                                                        <th> {lead["Lead-Email-Address"]} </th>
                                                        <td> {lead["Sales_Manager"]} </td>
                                                        <th> {lead["Message"]} </th>
                                                        <th> {lead["Virtual-Meet-Date-Time"]} </th>
                                                        <td><label className={statusClass[lead["Status"]]}>{lead["Status"]}</label></td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </React.Fragment>
        )
    }
}

export default withRouter(Leads)
