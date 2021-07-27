import React, { Component } from 'react'
// import Button from './form-input/Button';
import styles from '../styles/Home.module.scss';

class Datagrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const { data } = this.props;

        return (
            <div>
                <div className="row">
                    <div className="col-lg-12 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">{data.title}</h4>
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                {(
                                                    data.tableHeaders.map((colHeader, index) =>
                                                        <th key={index}> {colHeader.label} </th>
                                                    )
                                                )}
                                                <th key="edit"> Edit </th>
                                                <th key="delete"> Delete </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(
                                                data.tableData.reverse().map((lead, index) => 
                                                    <tr key={index}>
                                                        {(
                                                            data.tableHeaders.map((colHeader, index2) =>
                                                                <th key={index2}> {lead[colHeader.key]} </th>
                                                            )
                                                        )}
                                                        <th key="edit"> 
                                                            <span className={styles['grid-icon']} onClick = {() => this.props.onEdit(lead)}>
                                                                <i className="mdi mdi-grease-pencil"></i>
                                                            </span> 
                                                        </th>
                                                        <th key="delete">
                                                            <span className={styles['grid-icon']} onClick = {this.props.onDelete}> 
                                                                <i className="mdi mdi-delete"></i> 
                                                            </span>         
                                                        </th>
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

                {(
                    data.buttons.map((button, index) =>
                        <button key={index} type="button" className="btn btn-primary mr-2" onClick = {this.props.onAdd}>
                            {button.label}
                        </button>
                    )
                )}
            </div>
        )
    }
}

export default Datagrid