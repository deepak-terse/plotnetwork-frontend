import React, { Component } from 'react'
import styles from '../styles/Home.module.scss';
// import Form from '../containers/Form';
import { Form } from 'react-bootstrap';
import FormControl from './form-input/FormControl';
import axios from 'axios';
import { getAPIs } from '../utils/constants';
import sidePanelData from '../data/brokers-sidepanel.json';
import moment from 'moment';

class BrokerSidePanel extends Component {
    constructor(props) {
        super(props);
        const formState = { search : "" };
        this.props.data.fields.map((field, index) => {
            formState[field.id] = field.value;
        });

        formState.id = props.data.action === "UPDATE" ? props.data.id : "";
        formState.formFields = props.data;
        formState.action = props.data.action;
        this.state = formState;
    }

    onChangeHandler = (event) => {
        const inputData = {}
        inputData[event.target.name] = event.target.value;
        this.setState(inputData);
    }

    onSaveHandler = (event) => {
        var sidePanelForm = document.getElementById('sidePanelForm');
        if(sidePanelForm.checkValidity()){
            event.preventDefault();
            this.props.onSave(this.state);
        }
    }
    
    onSearchBroker = () => {
        this.getBroker(this.state.search)
    }

    render() {
        console.log("this.state ",this.state)
        let drawerClasses = styles.sideDrawer
        if(this.props.show) {
            drawerClasses = styles.sideDrawerOpen
        }
        const { data, onSave, onCancel } = this.props;
        const { formFields, action} =  this.state
        return(
            <div className={drawerClasses}>
                 <div className="grid-margin stretch-card">
                    <div id={styles.spcard} className="card">
                    <div className="card-body">
                        <h4 className="card-title"> {formFields.title} </h4>
                        <p className="card-description"> {formFields.subtitle} </p>
                        <form className="forms-sample" name="sidePanelForm" id="sidePanelForm">
                            {
                                action == "CREATE" ? (
                                    <>
                                        {
                                            <FormControl
                                                name="search"
                                                type="text"
                                                value={this.state.search}
                                                onChange={this.onChangeHandler} 
                                                className="form-control" 
                                                placeholder="Search broker by mobile number"
                                            /> 
                                            
                                        }
                                        <br/>
                                        <button className="btn btn-primary mr-2" type="button" onClick={this.onSearchBroker}>Search</button>
                                        <br/>
                                        <br/>
                                    </>
                                ) : ""
                            }
                                                        
                            {(
                                formFields.fields.map((field, index) =>
                                    <Form.Group className="row" key={index}>
                                        <label htmlFor={index} className="col-sm-3 col-form-label">{field.label}</label>
                                        <div className="col-sm-9">
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
                            <button className="btn btn-primary mr-2" type="submit" onClick={this.onSaveHandler}>SAVE</button>
                            <button className="btn btn-dark" type="button" onClick={onCancel}>CANCEL</button>
                            <br/>
                            <br/>
                            </form>                    
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    getBroker = (searchTerm) => {
        let params = {
            filter: {
                "partnerName": localStorage.getItem('partner'),
                "mobileNumber": searchTerm
            }
        };
        
        axios({
            method: 'get',
            url: getAPIs().broker,
            params: params
        }).then((response) => {
            if (response.status == 200){
                console.log("BROKER FOUND ",response.data.data);
                if(response.data.data.length > 0){
                    const broker = response.data.data[0]
                    // Populate values
                    const formState = { id : broker.id};
                    sidePanelData.fields.forEach((field, index) => {
                        if(field.id == "salesManagerName"){
                            formState[field.id] = broker.salesManagerId.id;
                        } else if(field.id == "date"){
                            formState["date"] = moment(broker.createdAt).format('DD-MM-YYYY, hh:mm A');
                        }else {
                            formState[field.id] = broker[field.id];
                        }
                    });
                    // Make fields disabled
                    formState.formFields = this.state.formFields;
                    formState.formFields.fields = this.state.formFields.fields.map((field) => {
                        if(field.id == "projectName" || field.id == "salesManagerName") field.disabled = false;                        
                        else field.disabled = true;

                        return field;
                    })
                    
                    // Set state
                    this.setState(formState)
                }
            } else if (response.status == 401) {
                console.log("User not exist");
            } else {
                console.log('Error found : ', response.data.message);
            }
        }).catch((error)=>{
            console.log('Error found : ', error);
        });
    }
}


export default BrokerSidePanel;

