import React, { Component } from 'react'
import styles from '../styles/Home.module.scss';
// import Form from '../containers/Form';
import { Form } from 'react-bootstrap';


class SidePanel extends Component {
    constructor(props) {
        super(props);
        const formState = {};
        this.props.data.fields.map((field, index) => {
            formState[field.id] = field.value;
        });

        formState.id = props.data.action === "UPDATE" ? props.data.id : "";

        this.state = formState;
    }

    onChangeHandler = (event) => {
        console.log("grllo", event.target)
        const inputData = {}
        inputData[event.target.name] = event.target.value;

        this.setState(inputData);
    }

    render() {
        let drawerClasses = styles.sideDrawer
        if(this.props.show) {
            drawerClasses = styles.sideDrawerOpen
        }
        const { data, onSave, onCancel } = this.props;
        console.log(data.fields);

        return(
            <div className={drawerClasses}>
                 <div className="grid-margin stretch-card">
                    <div className="card">
                    <div className="card-body">
                        <h4 className="card-title"> {data.title} </h4>
                        <p className="card-description"> {data.subtitle} </p>
                        <form className="forms-sample">
                            {(
                                data.fields.map((field, index) =>
                                    <Form.Group className="row" key={index}>
                                        <label htmlFor={index} className="col-sm-3 col-form-label">{field.label}</label>
                                        <div className="col-sm-9">
                                        {
                                            field.type !== "select" ?
                                            (
                                                <Form.Control 
                                                    name={field.id}
                                                    type={field.type} 
                                                    value={this.state[field.id]} 
                                                    onChange={this.onChangeHandler} 
                                                    className="form-control" 
                                                    id={index} 
                                                    placeholder={field.placeholder} />
                                            ) : 
                                            (
                                                <select name={field.id} id={index} className="form-control" value={this.state[field.id]} onChange={this.onChangeHandler}>
                                                    {
                                                        field.options.map((option, index) => 
                                                            <option key={index} value={option.fullName}>{option.fullName}</option>
                                                        )
                                                    }
                                                </select>
                                            )
                                        }

                                        </div>
                                    </Form.Group>
                                )
                            )}
                            <button className="btn btn-primary mr-2" onClick={(e) =>  {e.preventDefault(); onSave(this.state);}}>SAVE</button>
                            <button className="btn btn-dark" onClick={onCancel}>CANCEL</button>
                            </form>                    
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default SidePanel;

