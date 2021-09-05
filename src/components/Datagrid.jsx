import React, { Component } from 'react'
// import Button from './form-input/Button';
import styles from '../styles/Home.module.scss';
import { Form } from 'react-bootstrap';
import FormControl from '../components/form-input/FormControl';

class Datagrid extends Component {
    skip;
    limit;

    constructor(props) {
        super(props);
        const formState = {};
        this.props.data.filters.map((field, index) => {
            formState[field.id] = field.value;
        });
        this.state = formState;
        this.skip = 0;
        this.limit = 10;
    }

    onChangeHandler = (event) => {
        const inputData = {}
        inputData[event.target.name] = event.target.value;
        this.setState(inputData);
    }

    onReset = (e) => {
        e.preventDefault();
        const filterState = {};
        this.props.data.filters.map((field, index) => {
            filterState[field.id] = "";
        });
        this.setState(filterState);
        this.props.onFilter(this.state);
    }

    render() {
        const { data, onFilter } = this.props;
        return (
            <div>
                <div className="row" style={data.filters.length == 0 ? {display:'none'} : {}} >
                    <div className="col-lg-12 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Filters</h4>
                                <div className="table-responsive">
                                <form className="forms-sample form-inline">
                                    {(
                                        data.filters.map((field, index) =>
                                            <Form.Group key={index} style={field.isHidden ? {display:'none'} : {}}>
                                                <label htmlFor={index} className="col-sm-2 col-form-label">{field.label}</label>
                                                <div className="col-sm-3">
                                                {

                                                    <FormControl
                                                        name={field.id}
                                                        type={field.type} 
                                                        value={this.state[field.id]} 
                                                        onChange={this.onChangeHandler} 
                                                        className="form-control" 
                                                        id={index} 
                                                        disabled={field.disabled}
                                                        options={field.options}
                                                        placeholder={field.placeholder}
                                                        required={field.required}
                                                    />
                                                    
                                                }
                                                </div>
                                            </Form.Group>
                                        )
                                    )}
                                    <button className="btn btn-primary mr-2" onClick={(e) =>  {e.preventDefault(); onFilter(this.state);}}>FILTER</button>
                                    <button className="btn btn-dark" onClick={this.onReset}>RESET</button>
                                    <br/>
                                    <br/>
                                </form>
                                </div>
                            </div>
                        </div>
                    </div>                    
                </div>

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
                                                                <td key={index2} style={colHeader.isHidden ? {display:'none'} : {}}> {lead[colHeader.key] ? lead[colHeader.key] : "-"} </td> :
                                                                <td key={index2} style={colHeader.isHidden ? {display:'none'} : {}}> 
                                                                    <label className={colHeader.customStyle[lead[colHeader.key]]}>{lead[colHeader.key] ? lead[colHeader.key] : "-"}</label>
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