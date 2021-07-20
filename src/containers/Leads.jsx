import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import '../styles/Home.module.scss';

class Leads extends Component {
    constructor(props) {
        super(props);
    }

    render() {
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
                                                <th> Message </th>
                                                <th> Virtual Meet Time </th>
                                                <th> Status </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td> May 15, 2015 </td>
                                                <td> Herman Beck </td>
                                                <td> Deepak Beck </td>
                                                <th> 8097872267 </th>
                                                <th> deepakterse@gmail.com </th>
                                                <th> Want to meet </th>
                                                <th> 2021-05-07 3:00 </th>
                                                <td><label className="badge badge-danger">Pending</label></td>
                                            </tr>
                                            <tr>
                                                <td> May 15, 2015 </td>
                                                <td> Herman Beck </td>
                                                <td> Deepak Beck </td>
                                                <th> 8097872267 </th>
                                                <th> deepakterse@gmail.com </th>
                                                <th> Want to meet </th>
                                                <th> 2021-05-07 3:00 </th>
                                                <td><label className="badge badge-warning">In progress</label></td>
                                            </tr>
                                            <tr>
                                                <td> May 15, 2015 </td>
                                                <td> Herman Beck </td>
                                                <td> Deepak Beck </td>
                                                <th> 8097872267 </th>
                                                <th> deepakterse@gmail.com </th>
                                                <th> Want to meet </th>
                                                <th> 2021-05-07 3:00 </th>
                                                <td><label className="badge badge-info">Fixed</label></td>
                                            </tr>
                                            <tr>
                                                <td> May 15, 2015 </td>
                                                <td> Herman Beck </td>
                                                <td> Deepak Beck </td>
                                                <th> 8097872267 </th>
                                                <th> deepakterse@gmail.com </th>
                                                <th> Want to meet </th>
                                                <th> 2021-05-07 3:00 </th>
                                                <td><label className="badge badge-success">Completed</label></td>
                                            </tr>
                                            <tr>
                                                <td> May 15, 2015 </td>
                                                <td> Herman Beck </td>
                                                <td> Deepak Beck </td>
                                                <th> 8097872267 </th>
                                                <th> deepakterse@gmail.com </th>
                                                <th> Want to meet </th>
                                                <th> 2021-05-07 3:00 </th>
                                                <td><label className="badge badge-warning">In progress</label></td>
                                            </tr>
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
