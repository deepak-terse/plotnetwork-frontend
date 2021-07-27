import React, { Component } from 'react'
import styles from '../styles/Home.module.scss';
// import Form from '../containers/Form';
import { Form } from 'react-bootstrap';


class SidePanel extends Component {
    constructor(props) {
        super(props);
        console.log("$$$$$$$$$$$$$$$$$$$$$$$ constructor");
        const formState = {};
        this.props.data.fields.map((field, index) => {
            formState[field.id] = field.value;
        });

        this.state = formState;
    }

    componentDidUpdate() {
        // const formState = {};
        // this.props.data.fields.map((field, index) => {
        //     formState[field.id] = field.value;
        // });

        // this.state = formState;
    }

    onChangeHandler = (event) => {
        console.log(event);
        console.log(event.target.name);

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
                                        <Form.Control 
                                            name={field.id}
                                            type={field.type} 
                                            value={this.state[field.id]} 
                                            onChange={this.onChangeHandler} 
                                            className="form-control" 
                                            id={index} 
                                            placeholder={field.placeholder} />
                                        </div>
                                    </Form.Group>
                                )
                            )}
                            <button className="btn btn-primary mr-2" onClick={onSave}>SAVE</button>
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

