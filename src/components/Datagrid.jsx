import React, { Component } from 'react'
// import Button from './form-input/Button';
import styles from '../styles/Home.module.scss';

class Datagrid extends Component {
    skip;
    limit;

    constructor(props) {
        super(props);
        this.state = {}
        this.skip = 0;
        this.limit = 10;
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
                                    <table className="table table-striped table-bordered">
                                        <thead>
                                            <tr>
                                                {(
                                                    data.tableHeaders.map((colHeader, index) => 

                                                        <th key={index} style={colHeader.isHidden ? {display:'none'} : {}}> {colHeader.label} </th>

                                                    )
                                                )}
                                                { data.actions.isEdit ? <th key="edit"> Edit </th> : ""}
                                                { data.actions.isDelete ? <th key="delete"> Delete </th> : ""}                                                
                                                
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(
                                                data.tableData.map((lead, index) => 
                                                    <tr key={index}>
                                                        {(
                                                            data.tableHeaders.map((colHeader, index2) =>
                                                                !colHeader.customStyle ?
                                                                <td key={index2} style={colHeader.isHidden ? {display:'none'} : {}}> {lead[colHeader.key]} </td> :
                                                                <td key={index2} style={colHeader.isHidden ? {display:'none'} : {}}> 
                                                                    <label className={colHeader.customStyle[lead[colHeader.key]]}>{lead[colHeader.key]}</label>
                                                                </td>
                                                            )
                                                        )}
                                                        {
                                                            data.actions.isEdit ?
                                                            <td key="edit"> 
                                                                <span className={styles['grid-icon']} onClick = {() => this.props.onEdit(lead)}>
                                                                    <i className="mdi mdi-grease-pencil"></i>
                                                                </span> 
                                                            </td> : ""
                                                        }
                                                        {
                                                            data.actions.isDelete ?
                                                            <td key="delete">
                                                                <span className={styles['grid-icon']} onClick = {() => this.props.onDelete(lead)}> 
                                                                    <i className="mdi mdi-delete"></i> 
                                                                </span>         
                                                            </td> : ""
                                                        }
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
                        <button key={index} type="button" className="btn btn-primary mr-2" onClick = {this.props[button.onClick]}>
                            {button.label}
                        </button>
                    )
                )}

                <button disabled={this.skip <= 0} style={{'background-color': '#fff', color: '#000'}} className="btn mr-2" onClick = {this.onPrev}> PREV </button>
                <button disabled={(this.skip + this.limit) > data.totalCount} style={{'background-color': '#fff', color: '#000'}} className="btn mr-2" onClick = {this.onNext}> NEXT </button>
                <span style={{color:'#d0d0d0'}}> Showing {this.skip}-{this.skip + data.tableData.length} 0f {data.totalCount} records</span>
            </div>
        )
    }
     
    onPrev = () => {
        const newSkip = this.skip - this.limit
        if(newSkip >= 0) {
            this.skip = newSkip
            this.props.loadData(this.skip);
        }
    }

    onNext = () => {
        const newSkip = this.skip + this.limit
        if(newSkip < this.props.data.totalCount) {
            this.skip = newSkip
            this.props.loadData(this.skip);
        }
    }
}

export default Datagrid