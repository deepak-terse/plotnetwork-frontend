import React, { Component } from 'react'
import styles from '../styles/Home.module.scss';
// import Form from '../containers/Form';
import { Form } from 'react-bootstrap';
import moment from 'moment';
import FormControl from '../components/form-input/FormControl';

class SidePanel extends Component {
    constructor(props) {
        super(props);

        const projects = JSON.parse(localStorage.getItem('projects'));
        const brokersByProjectId = projects.map((project) => {
            return {
                projectId : project.id,
                brokers : project.brokers
            }
        })

        const formState = { // Initite state with user's projects with brokers assigned to it
            brokersByProjectId : brokersByProjectId,
            formData : this.props.data
        };
        this.props.data.fields.map((field, index) => {
            formState[field.id] = field.value;
        });

        formState.id = props.data.action === "UPDATE" ? props.data.id : "";

        this.state = formState;
    }

    onChangeHandler = (event) => {
        const inputData = {}
        inputData[event.target.name] = event.target.value;
        if(event.target.name == "projectName"){
            const projectSelected = event.target.value;
            inputData.formData = this.state.formData;
            inputData["brokerName"] =  "";
            inputData.formData.fields = inputData.formData.fields.map(field => {
                if(field.id == "brokerName"){
                    const brokerAssignedToProject = this.state.brokersByProjectId.filter((project) => {
                        if(project.projectId == projectSelected){
                            return project.brokers;
                        }
                    });
                    if(brokerAssignedToProject.length > 0){
                        field.options = brokerAssignedToProject[0].brokers;
                    }
                }
                return field;
            });
        } else if(event.target.name == "brokerName"){
            const brokerSelected = event.target.value;
            inputData.formData = this.state.formData;
            inputData["salesManagerName"] =  "";
            inputData.formData.fields = inputData.formData.fields.map(field => {
                if(field.id == "salesManagerName"){
                    const projectSelected = this.state.projectName;
                    for (let index = 0; index < this.state.brokersByProjectId.length; index++) {
                        const project = this.state.brokersByProjectId[index];
                        if(project.projectId == projectSelected){
                            project.brokers.forEach((broker) => {
                                if(broker.id == brokerSelected) {
                                    field.options = [broker.salesManagerId];
                                }
                            })
                            break;
                        }
                    }
                }
                return field;
            });
        }
        this.setState(inputData);
    }

    onSaveHandler = (event) => {
        var sidePanelForm = document.getElementById('sidePanelForm');
        if(sidePanelForm.checkValidity()){
            event.preventDefault();
            this.props.onSave(this.state);
        }
    }

    render() {
        let drawerClasses = styles.sideDrawer
        if(this.props.show) {
            drawerClasses = styles.sideDrawerOpen
        }
        const { data, onSave, onCancel } = this.props;
        const { formData } = this.state;

        return(
            <div className={drawerClasses}>
                 <div className="grid-margin stretch-card">
                    <div id={styles.spcard} className="card">
                    <div className="card-body">
                        <h4 className="card-title"> {formData.title} </h4>
                        <p className="card-description"> {formData.subtitle} </p>
                        <form className="forms-sample" name="sidePanelForm" id="sidePanelForm">
                            {(
                                formData.fields.map((field, index) =>
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
                                            
                                            // field.type !== "select" ?
                                            // (
                                            //     // <Form.Control 
                                            //     //     name={field.id}
                                            //     //     type={field.type} 
                                            //     //     value={this.state[field.id]} 
                                            //     //     onChange={this.onChangeHandler} 
                                            //     //     className="form-control" 
                                            //     //     id={index} 
                                            //     //     disabled={field.disabled}
                                            //     //     placeholder={field.placeholder} />

                                            //     <TextInput
                                            //         name={field.id}
                                            //         type={field.type} 
                                            //         value={this.state[field.id]} 
                                            //         onChange={this.onChangeHandler} 
                                            //         className="form-control" 
                                            //         id={index} 
                                            //         disabled={field.disabled}
                                            //         placeholder={field.placeholder}
                                            //     />
                                            // ) : 
                                            // (
                                            //     <select name={field.id} id={index} 
                                            //         className="form-control" 
                                            //         value={this.state[field.id] == "" ? field.options[0].id : this.state[field.id]} 
                                            //         disabled={field.disabled}
                                            //         onChange={this.onChangeHandler}>
                                            //         {
                                            //             field.options.map((option, index) => 
                                            //                 <option key={index} value={option.id}>{option.fullName}</option>
                                            //             )
                                            //         }
                                            //     </select>
                                            // )
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
}


export default SidePanel;

