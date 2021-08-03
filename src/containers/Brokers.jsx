import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import '../styles/Home.module.scss';
import SidePanel from '../components/SidePanel';
import Datagrid from '../components/Datagrid';
import Backdrop from '../components/Backdrop';

import sidePanelData from '../data/brokers-sidepanel.json';
import datagridData from '../data/brokers-datagrid.json';
import axios from 'axios';
import { getAPIs } from '../utils/constants';

class Brokers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            drawerOpen: false,
            datagridProps: datagridData,
            SidePanelProps: sidePanelData
        }

        this.getBroker();
        // this.createBroker();
        // this.updateBroker();
        // this.deleteBroker();
    }

    onAddHandler = () => {
        sidePanelData.fields.forEach((key, index) => {
            sidePanelData.fields[index].value = "";
        });
        this.setState({
            SidePanelProps: sidePanelData,
            drawerOpen: true
        })
    }

    onUpdateHandler = (data) => {
        let SPProps = sidePanelData;
        sidePanelData.fields.forEach((key, index) => {
            sidePanelData.fields[index].value = data[key.id];
        });
        this.setState({
            SidePanelProps: SPProps,
            drawerOpen: true
        })
    }

    onDeleteHandler = (drawerOpen, ) => {

    }


    onSaveHandler = () => {

    }

    onCancelHandler = () => {
        this.backdropClickHandler();
    }

    backdropClickHandler = () => {
        this.setState({
          drawerOpen: false
        })
    }

    render() {
        const { drawerOpen, datagridProps, SidePanelProps} = this.state;

        let backdrop;
        if(this.state.drawerOpen){
            backdrop = <Backdrop close={this.backdropClickHandler}/>;
        }

        return (
            <React.Fragment>
                { drawerOpen ? 
                    <SidePanel 
                        data={SidePanelProps} 
                        show={drawerOpen}
                        onSave={this.onSaveHandler}
                        onCancel={this.onCancelHandler}
                    /> 
                  : ""
                }
                {backdrop}   
                <Datagrid 
                    data={datagridProps} 
                    onAdd={this.onAddHandler}
                    onEdit={this.onUpdateHandler}
                    onDelete={this.onDeleteHandler}
                />   
            </React.Fragment>
        )
    }
    
    getBroker = () => {
        axios({
            method: 'get',
            url: getAPIs().broker,
            data: {}
        }).then((response) => {
            console.log(response);
            if (response.status == 200){
                console.log('User fetched');
                let temp = this.state.datagridProps;
                temp.tableData = response.data.data;
                this.setState({
                    datagridProps: temp
                })
                
            } else if (response.status == 401) {
                console.log("User not exist");
            } else {
                console.log('Error found : ', response.data.message);
            }
        }).catch((error)=>{
            console.log('Error found : ', error);
        });
    }

    createBroker = () => {
        axios({
            method: 'post',
            url: getAPIs().broker,
            data: {
                "user": {
                    "userType": "admin"
                },
                "data": {
                    "fullName": "Test",
                    "mobileNumber": "8888888888",
                    "emailId": "test@gmail.com",
                    "reraNumber": "ASU373938204",
                    "address": "tEST aDDRESS",
                    "companyName": "Test",
                    "salesManagerId": "6106ad6241b9381c60eb6f22"
                }
            }
        }).then((response) => {
            console.log(response);
            if (response.status == 200){
                console.log('User created');
                
            } else if (response.status == 401) {
                console.log("Invalid input");
            } else {
                console.log('Error found : ', response.data.message);
            }
        }).catch((error)=>{
            console.log('Error found : ', error);
        });
    }
    
    updateBroker = () => {
        axios({
            method: 'put',
            url: getAPIs().broker,
            data: {
                    "user": {
                        "userType": "admin"
                    },
                    "data": {
                        "id": "6106e372060e18459cee54dd",
                        "fullName": "Test2",
                        "mobileNumber": "9819223239",
                        "emailId": "archanatest@gmail.com"
                    }
                
            }
        }).then((response) => {
            console.log(response);
            if (response.status == 200){
                console.log('User updated');
                
            } else if (response.status == 401) {
                console.log("User not exist");
            } else {
                console.log('Error found : ', response.data.message);
            }
        }).catch((error)=>{
            console.log('Error found : ', error);
        });
    }

    deleteBroker = () => {
        axios({
            method: 'delete',
            url: getAPIs().broker,
            data: {
                "user": {
                    "userType": "admin"
                },
                "data": {
                    "id": "6106e372060e18459cee54dd"
                }
            }
        }).then((response) => {
            console.log(response);
            if (response.status == 200){
                console.log('User deleted');
                
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



export default withRouter(Brokers);