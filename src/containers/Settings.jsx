import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styles from '../styles/Home.module.scss';
import { Form } from 'react-bootstrap';
import FormControl from '../components/form-input/FormControl';

import '../App.scss';
import "../utils/i18n";

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expiryTime: ""
        }
    }

    render() {
        return (<React.Fragment>
             <div className="grid-margin stretch-card">
                    <div id={styles.spcard} className="card">
                    <div className="card-body">
                        <h4 className="card-title"> {"Settings"} </h4>
                        {/* <p className="card-description"> {data.subtitle} </p> */}
                        <form className="forms-sample">
                            <Form.Group className="row">
                                <label htmlFor="expire-time" className="col-md-2 col-form-label">Lead Expiry Time :</label>
                                <div className="col-md-4">
                                    <FormControl 
                                        name="expire-time"
                                        id="expire-time"
                                        type="text" 
                                        value={this.state.expiryTime} 
                                        onChange={this.onChangeHandler} 
                                        className="form-control" 
                                        placeholder="Enter lead expiry time" />    
                                </div>
                            </Form.Group>
                            <button className="btn btn-primary mr-2" onClick={(e) =>  {e.preventDefault(); this.onSave(this.state);}}>SAVE</button>
                            <button className="btn btn-dark" onClick={this.onCancel}>CANCEL</button>
                            <br/>
                            <br/>
                            </form>                    
                        </div>
                    </div>
                </div>
        </React.Fragment>)
    }

    onChangeHandler = (event) => {
        const inputData = {}
        inputData[event.target.name] = event.target.value;
        this.setState(inputData);
    }

    onSave = (data) => {
        if(this.state.SidePanelProps.action === "CREATE") {
            this.createSalesManager(data);
        } else {
            this.updateSalesManager(data);
        }
        this.backdropClickHandler();
    }

    onCancel = () => {
        this.backdropClickHandler();
    }
}

// export default Home
export default withRouter(Settings);
