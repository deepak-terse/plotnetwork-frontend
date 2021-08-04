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
        sidePanelData.fields.forEach((key, index) => {
            sidePanelData.fields[index].value = data[key.id];
        });
        this.setState({
            SidePanelProps: sidePanelData,
            drawerOpen: true
        })
    }

    onDeleteHandler = (data) => {
        this.deleteBroker(data.id);
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

    getSalesManager = () => {
        axios({
            method: 'get',
            url: getAPIs().salesmanager,
            data: {}
        }).then((response) => {
            if (response.status == 200){
                console.log('User fetched');

                let temp = this.state.SidePanelProps;
                temp.fields.forEach((key, index) => {
                    if(temp.fields[index].id === "salesManagerName") {
                        temp.fields[index].options = response.data.data;
                    }
                });
                console.log(temp);
                this.setState({
                    SidePanelProps: temp
                })
                
            } else if (response.status == 401) {
                console.log("Invalid user");
            } else {
                console.log('Error found : ', response.data.message);
            }
        }).catch((error)=>{
            console.log('Error found : ', error);
        });
    }
    
    getBroker = () => {
        axios({
            method: 'get',
            url: getAPIs().broker,
            data: {}
        }).then((response) => {
            if (response.status == 200){
                console.log('User fetched');
                let temp = this.state.datagridProps;
                temp.tableData = response.data.data;
                temp.tableData.map( (e) => {
                    e.salesManagerName = e.salesManagerId.fullName;
                    e.salesManagerId = e.salesManagerId.id

                    return e;
                })
                this.setState({
                    datagridProps: temp
                })
                this.getSalesManager();
                
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
        let temp = JSON.parse(localStorage.getItem('loggedInUser'));

        axios({
            method: 'post',
            url: getAPIs().broker,
            data: {
                "user": {
                    userType:temp.userType
                },
                "data": {
                    "fullName": "Test",
                    "mobileNumber": "8888888888",
                    "emailId": "test@gmail.com",
                    "reraNumber": "ASU373938204",
                    "address": "tEST aDDRESS",
                    "companyName": "Test",
                    "salesManagerId": "Archana Mam"
                }
            }
        }).then((response) => {
            if (response.status == 200){
                console.log('User created');
                this.getBroker();
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
        let temp = JSON.parse(localStorage.getItem('loggedInUser'));

        axios({
            method: 'put',
            url: getAPIs().broker,
            data: {
                    "user": {
                        userType:temp.userType
                    },
                    "data": {
                        "id": "6106e372060e18459cee54dd",
                        "fullName": "Test2",
                        "mobileNumber": "9819223239",
                        "emailId": "archanatest@gmail.com"
                    }
            }
        }).then((response) => {
            if (response.status == 200){
                console.log('User updated');
                this.getBroker();
            } else if (response.status == 401) {
                console.log("User not exist");
            } else {
                console.log('Error found : ', response.data.message);
            }
        }).catch((error)=>{
            console.log('Error found : ', error);
        });
    }

    deleteBroker = (dataId) => {
        let temp = JSON.parse(localStorage.getItem('loggedInUser'));

        axios({
            method: 'delete',
            url: getAPIs().broker,
            data: {
                "user": {
                    userType:temp.userType
                },
                "data": {
                    id:dataId
                }
            }
        }).then((response) => {
            if (response.status == 200){
                console.log('User deleted');
                this.getBroker();
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