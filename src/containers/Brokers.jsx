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
import moment from 'moment';

class Brokers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            drawerOpen: false,
            datagridProps: datagridData,
            SidePanelProps: sidePanelData
        }

        
        this.getBroker(0);
        
    }

    onAddHandler = () => {
        sidePanelData.fields.forEach((key, index) => {
            //ToDo: Need to refactor. No field specific code
            if(sidePanelData.fields[index].id == "date"){
                sidePanelData.fields[index].value = moment().format('DD-MM-YYYY');
            } else {
                sidePanelData.fields[index].value = "";
            }
        });
        sidePanelData.action = "CREATE";
        this.setState({
            SidePanelProps: sidePanelData,
            drawerOpen: true
        })
    }

    onUpdateHandler = (data) => {
        sidePanelData.fields.forEach((key, index) => {
            if(key.id == "salesManagerName"){
                sidePanelData.fields[index].value = data["salesManagerId"];
            } else {
                sidePanelData.fields[index].value = data[key.id];
            }
        });
        sidePanelData.action = "UPDATE";
        sidePanelData.id = data.id;
        this.setState({
            SidePanelProps: sidePanelData,
            drawerOpen: true
        })
    }

    onDeleteHandler = (data) => {
        this.deleteBroker(data.id);
    }


    onSaveHandler = (data) => {
        if(this.state.SidePanelProps.action === "CREATE") {
            this.createBroker(data);
        } else {
            this.updateBroker(data);
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
                    loadData={this.getBroker}
                />   
            </React.Fragment>
        )
    }

    getSalesManager = () => {
        axios({
            method: 'get',
            url: getAPIs().salesmanager,
            params: {
                filter: {
                    "partnerName": localStorage.getItem('partner')
                }
            }
        }).then((response) => {
            if (response.status == 200){
                let temp = this.state.SidePanelProps;
                temp.fields.forEach((key, index) => {
                    if(temp.fields[index].id === "salesManagerName") {
                        temp.fields[index].options = response.data.data;
                    }
                });
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
    
    getBroker = (skip) => {
        let params = {
            skip: skip,
            limit: 10,
            filter: {
                "partnerName": localStorage.getItem('partner')
            }
        };
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        if(user.userType !== "admin") {
            params.salesManagerId = user.user.id;
        }
        

        axios({
            method: 'get',
            url: getAPIs().broker,
            params: params
        }).then((response) => {
            if (response.status == 200){
                let temp = this.state.datagridProps;
                temp.tableData = response.data.data;
                temp.tableData.map( (e) => {
                    e.salesManagerName = e.salesManagerId.fullName;
                    e.salesManagerId = e.salesManagerId.id

                    e.date = moment(e.createdAt).format('DD-MM-YYYY, hh:mm A'); // format date in required format

             return e;
                })

                temp.totalCount  = response.data.count;

                if(user.userType !== "admin") {
                    temp.tableHeaders.map( (e) => {
                        if(e.key === "salesManagerName"){
                            e.isHidden = true;
                        }
                        return e;
                    })

                    // assign SM record fetch from logged in for SM user
                    let sidePaneltemp = this.state.SidePanelProps;
                    sidePaneltemp.fields.forEach((key, index) => {
                        if(key.id === "salesManagerName") {
                            key.options = [user.user];
                        }
                    });
                    this.setState({
                        datagridProps: temp,
                        SidePanelProps: sidePaneltemp
                    })
                } else {
                    this.setState({
                        datagridProps: temp
                    })
                    this.getSalesManager();
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

    createBroker = (data) => {
        let temp = JSON.parse(localStorage.getItem('loggedInUser'));
        axios({
            method: 'post',
            url: getAPIs().broker,
            data: {
                "user": {
                    userType:temp.userType
                },
                "data": {
                    "fullName": data.fullName,
                    "mobileNumber": data.mobileNumber,
                    "emailId": data.emailId,
                    "alternateEmailId": data.alternateEmailId,
                    "reraNumber": data.reraNumber,
                    "address": data.address,
                    "companyName": data.companyName,
                    "salesManagerId": data.salesManagerName,
                    "partnerName": localStorage.getItem('partner')
                }
            }
        }).then((response) => {
            if (response.status == 200){
                console.log('User created');
                this.getBroker(0);
            } else if (response.status == 401) {
                console.log("Invalid input");
            } else {
                console.log('Error found : ', response.data.message);
            }
        }).catch((error)=>{
            console.log('Error found : ', error);
        });
    }
    
    updateBroker = (data) => {
        let temp = JSON.parse(localStorage.getItem('loggedInUser'));
        axios({
            method: 'put',
            url: getAPIs().broker,
            data: {
                    "user": {
                        userType:temp.userType
                    },
                    "data": {
                        "id": data.id,
                        "fullName": data.fullName,
                        "mobileNumber": data.mobileNumber,
                        "emailId": data.emailId,
                        "alternateEmailId": data.alternateEmailId,
                        "reraNumber": data.reraNumber,
                        "address": data.address,
                        "companyName": data.companyName,
                        "salesManagerId": data.salesManagerName
                    }
            }
        }).then((response) => {
            if (response.status == 200){
                console.log('User updated');
                this.getBroker(0);
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
                this.getBroker(0);
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