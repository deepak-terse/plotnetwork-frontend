import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import '../styles/Home.module.scss';
import SidePanel from '../components/SidePanel';
import Datagrid from '../components/Datagrid';
import Backdrop from '../components/Backdrop';

import sidePanelData from '../data/salesteam-sidepanel.json';
import datagridData from '../data/salesteam-datagrid.json';
import axios from 'axios';
import { getAPIs } from '../utils/constants';

class SalesTeam extends Component {
    constructor(props) {
        
        super(props);
        

        this.state = {
            drawerOpen: false,
            datagridProps: datagridData,
            SidePanelProps: sidePanelData
        }
        console.log("again");
        this.getSalesManager();
    }

    onAddHandler = () => {
        sidePanelData.fields.forEach((key, index) => {
            sidePanelData.fields[index].value = "";
        });
        sidePanelData.action = "CREATE";
        this.setState({
            SidePanelProps: sidePanelData,
            drawerOpen: true
        })
        console.log("this.state ", this.state)
    }

    onUpdateHandler = (data) => {
        sidePanelData.fields.forEach((key, index) => {
            sidePanelData.fields[index].value = data[key.id];
        });
        sidePanelData.action = "UPDATE";
        sidePanelData.id = data.id;
        console.log("sidePanelData ", sidePanelData);
        this.setState({
            SidePanelProps: sidePanelData,
            drawerOpen: true
        })
    }

    onDeleteHandler = (data) => {
        console.log(data);
        this.deleteSalesManager(data.id)
    }

    onSaveHandler = (data) => {
        console.log(data);
        if(this.state.SidePanelProps.action === "CREATE") {
            this.createSalesManager(data);
        } else {
            this.updateSalesManager(data);
        }
        this.backdropClickHandler();
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

        console.log(this.state.SidePanelProps);

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

                let temp = this.state.datagridProps;
                temp.tableData = response.data.data;
                this.setState({
                    datagridProps: temp
                })
                console.log(this.state.datagridProps)
                
            } else if (response.status == 401) {
                console.log("Invalid user");
            } else {
                console.log('Error found : ', response.data.message);
            }
        }).catch((error)=>{
            console.log('Error found : ', error);
        });
    }

    createSalesManager = (data) => {
        console.log(data);
        let temp = JSON.parse(localStorage.getItem('loggedInUser'));

        axios({
            method: 'post',
            url: getAPIs().salesmanager,
            data: {
                "user": {
                    userType:temp.userType
                },
                "data": {
                    "fullName": data.fullName,
                    "mobileNumber": data.mobileNumber,
                    "emailId": data.emailId
                }
            }
        }).then((response) => {
            console.log(response);
            if (response.status == 200){
                console.log('User created');
                this.getSalesManager();
            } else if (response.status == 401) {
                console.log("Invalid input");
            } else {
                console.log('Error found : ', response.data.message);
            }
        }).catch((error)=>{
            console.log('Error found : ', error);
        });
    }
    
    updateSalesManager = (data) => {
        console.log(data);
        let temp = JSON.parse(localStorage.getItem('loggedInUser'));

        axios({
            method: 'put',
            url: getAPIs().salesmanager,
            data: {
                "user": {
                    userType:temp.userType
                },
                "data": {
                    "id": data.id,
                    "fullName": data.fullName,
                    "mobileNumber": data.mobileNumber,
                    "emailId": data.emailId
                }
            }
        }).then((response) => {
            console.log(response);
            if (response.status == 200){
                console.log('User updated');
                this.getSalesManager();
            } else if (response.status == 401) {
                console.log("User did not exist");
            } else {
                console.log('Error found : ', response.data.message);
            }
        }).catch((error)=>{
            console.log('Error found : ', error);
        });
    }

    deleteSalesManager = (dataId) => {
        let temp = JSON.parse(localStorage.getItem('loggedInUser'));

        axios({
            method: 'delete',
            url: getAPIs().salesmanager,
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
                this.getSalesManager();
            } else if (response.status == 401) {
                console.log("User did not exist");
            } else {
                console.log('Error found : ', response.data.message);
            }
        }).catch((error)=>{
            console.log('Error found : ', error);
        });
    }


    
}

export default withRouter(SalesTeam)
