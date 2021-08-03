import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
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
        this.getSalesManager();
    }

    onAddHandler = () => {
        sidePanelData.fields[0].value = "";
        sidePanelData.fields[1].value = "";
        sidePanelData.fields[2].value = "";
        this.setState({
            SidePanelProps: sidePanelData,
            drawerOpen: true
        })
    }

    onUpdateHandler = (data) => {
        let SPProps = sidePanelData;
        SPProps.fields[0].value = data.name;
        SPProps.fields[1].value = data.mobileNumber;
        SPProps.fields[2].value = data.email;
        this.setState({
            SidePanelProps: SPProps,
            drawerOpen: true
        })
    }

    onDeleteHandler = (data) => {
        console.log(data);
        this.deleteSalesManager(data.id)

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
            console.log(response);
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

    createSalesManager = () => {
        axios({
            method: 'post',
            url: getAPIs().salesmanager,
            data: {
                "user": {
                    "userType": "admin"
                },
                "data": {
                    "fullName": "Suprabhat",
                    "mobileNumber": "9819223230",
                    "emailId": "archanaa@gmail.com"
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
    
    updateSalesManager = () => {
        axios({
            method: 'put',
            url: getAPIs().salesmanager,
            data: {
                "user": {
                    "userType": "admin",
                    "id": "6106b3342aa6044da093bb7f"
                },
                "data": {
                    "id": "6106b3342aa6044da093bb7e",
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
                console.log("User did not exist");
            } else {
                console.log('Error found : ', response.data.message);
            }
        }).catch((error)=>{
            console.log('Error found : ', error);
        });
    }

    deleteSalesManager = (dataId) => {
        let temp = localStorage.getItem('loggedInUser');
        console.log(temp);

        axios({
            method: 'delete',
            url: getAPIs().salesmanager,
            data: {
                "user": {
                    userId:temp,
                    
                },
                "data": {
                    id:dataId
                }
            }
        }).then((response) => {
            console.log(response);
            if (response.status == 200){
                console.log('User deleted');
                
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
