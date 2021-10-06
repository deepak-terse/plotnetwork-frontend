import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import '../styles/Home.module.scss';
import SidePanel from '../components/SidePanel';
import Datagrid from '../components/Datagrid';
import Backdrop from '../components/Backdrop';

import sidePanelData from '../data/leads-sidepanel.json';
import datagridData from '../data/leads-datagrid.json';
import axios from 'axios';
import { getAPIs } from '../utils/constants';
import moment from 'moment'
import numeral from 'numeral';

class Leads extends Component {
    constructor(props) {
        super(props);
        this.state = {
            drawerOpen: false,
            datagridProps: datagridData,
            SidePanelProps: sidePanelData,
            filter: {
                "partnerName": localStorage.getItem('partner')
            }
        }

        this.getLead(0);
        this.getProjects();
        this.getBroker();
        this.setData();
        
    }

    setData = () => {
        const user = JSON.parse(localStorage.getItem('loggedInUser'));

        if(user.userType === "admin") {
            this.getSalesManager();
        } else {
            // add logged in SM record in salesManagerName dropdown of Side Panel
            let temp = this.state.SidePanelProps;
            temp.fields.forEach((field, index) => {
                if(field.id === "salesManagerName") {
                    field.options = [user.user]
                }
            });

            this.setState({
                SidePanelProps: temp
            })
        }
    }

    onAddHandler = () => {
        const newSidePanelData = sidePanelData;
        newSidePanelData.fields.forEach((field, index) => {
            if(field.id == "date"){
                field.value = moment().format('DD-MM-YYYY');
            } else {
                field.value = "";
                field.disabled = false;
                if(field.id == "brokerName" || field.id == "salesManagerName" || field.id == "projectName") field.options = [];
                if(field.id == "projectName"){
                    const projects = JSON.parse(localStorage.getItem('projects'));
                    const newProjects = projects.map((project) => {
                        project.fullName = project.projectName
                        return project;
                    })
                    field.options = newProjects;
                }
            }
        });
        newSidePanelData.action = "CREATE";
        this.setState({
            SidePanelProps: newSidePanelData,
            drawerOpen: true
        })
    }

    onExportHandler = () => {
        this.getLeadsExport();
    }

    onUpdateHandler = (data) => {
        console.log("data to update ", data)

        sidePanelData.fields.forEach((field, index) => {
            switch (field.id) {
                case 'dob':
                    field.value = moment(data[field.id],['DD-MM-YYYY']).format('YYYY-MM-DD');
                    break;

                case 'virtualMeetTime':
                    //Need to refactor
                    if(data[field.id] !== "-"){ // if meetTime exists then only format it
                        var vmTimeDate = new Date(moment(data[field.id],['DD-MM-YYYY, hh:mm A']).format());
                        field.value =  new Date(vmTimeDate.getTime() + new Date().getTimezoneOffset() * -60 * 1000).toISOString().slice(0, 19);
                    }
                    
                    break;

                case 'projectName':
                    field.value =  data["projectId"];
                    field.options = [data["projectData"]];
                    break;

                case 'salesManagerName':
                    field.value =  data["salesManagerId"];
                    field.options = [data["salesManagerData"]];
                    break;

                case 'brokerName':
                    field.value =  data["brokerId"];
                    field.options = [data["brokerData"]];
                    break;

                case 'budget':
                    var fullNumber = numeral(data[field.id])._value;
                    field.value = numeral(fullNumber).format('0,0');
                    break;
            
                default:
                    field.value = data[field.id];
                    break;
            }

            if(sidePanelData.disabledFieldsOnEdit.includes(field.id)){
                field.disabled = true;
            }

        });
        sidePanelData.action = "UPDATE";
        sidePanelData.id = data.id;
        this.setState({
            SidePanelProps: sidePanelData,
            drawerOpen: true
        })
    }

    // onDeleteHandler = (data) => {
    //     this.deleteLead(data.id);
    // }



    onSaveHandler = (data) => {
        console.log("savee ", data)
        if(this.state.SidePanelProps.action === "CREATE") {
            this.createLead(data);
        } else {
            this.updateLead(data);
        }
        this.backdropClickHandler();
    }

    onCancelHandler = () => {
        this.backdropClickHandler();
    }

    onFilter = (data) => {
       if(data.salesManagerName !== ""){
            data.salesManagerId = data.salesManagerName;
        }

        if(data.brokerName !== ""){
            data.brokerId = data.brokerName;
        }
        
        delete data.salesManagerName;
        delete data.brokerName;
        data.partnerName = localStorage.getItem('partner');
        this.setState({
            filter: data
        }, function() {
            this.getLead(0);
        })

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
                    onExport={this.onExportHandler}
                    onEdit={this.onUpdateHandler}
                    loadData={this.getLead}
                    onFilter={this.onFilter}
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

                let temp2 = this.state.datagridProps;
                temp2.filters.forEach((key, index) => {
                    if(temp2.filters[index].id === "salesManagerName") {
                        temp2.filters[index].options = response.data.data;
                    }
                });

                this.setState({
                    datagridProps: temp2
                })
                console.log(this.state);
                
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
        let params = {
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

                let temp2 = this.state.datagridProps;
                temp2.filters.forEach((key, index) => {
                    if(temp2.filters[index].id === "brokerName") {
                        temp2.filters[index].options = response.data.data;
                    }
                });

                this.setState({
                    datagridProps: temp2
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

    getLeadsExport = () => {
        let params = {
            "filter": this.state.filter
        };
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        if(user.userType !== "admin") {
            params.filter.salesManagerId = user.user.id;
        }
        axios({
            method: 'get',
            url: getAPIs().leadexport,
            params: params
        }).then((response) => {
            if (response.status == 200){
                window.open(getAPIs().baseURL + response.data.data);
            } else if (response.status == 401) {
                console.log("Invalid user");
            } else {
                console.log('Error found : ', response.data.message);
            }
        }).catch((error)=>{
            console.log('Error found : ', error);
        });
    }
    
    getLead = (skip) => {
        let params = {
            skip: skip,
            limit: 10,
            filter: this.state.filter
        };
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        if(user.userType !== "admin") {
            params.filter.salesManagerId = user.user.id;
        }

        axios({
            method: 'get',
            url: getAPIs().lead,
            params: params
        }).then((response) => {
            if (response.status == 200){
                console.log('User fetched', response.data); 
                let temp = this.state.datagridProps;
                temp.tableData = response.data.data;
                temp.tableData.map( (e) => {
                    e.salesManagerName = e.salesManagerId.fullName;
                    e.salesManagerData = e.salesManagerId;
                    e.salesManagerId = e.salesManagerId.id

                    e.brokerName = e.brokerId.fullName;
                    e.brokerData = e.brokerId;
                    e.brokerId = e.brokerId.id;

                    e.projectName = e.projectId.projectName;
                    e.projectId.fullName = e.projectId.projectName;
                    e.projectData = e.projectId;
                    e.projectId = e.projectId.id;

                    // e.date = new Date(e.createdAt).toUTCString();

                    e.date = moment(e.createdAt).format('DD-MM-YYYY, hh:mm A')
                    e.dob = e.dob ? moment(e.dob).format('DD-MM-YYYY') : "";
                    e.virtualMeetTime = e.virtualMeetTime !== 0 ? moment(e.virtualMeetTime).format('DD-MM-YYYY, hh:mm A') : "-";

                    // format number
                    e.budget = numeral(e.budget).format('0.0a');

                    return e;
                })

                if(user.userType == "admin") {
                    temp.filters.map( (e) => {
                        if(e.id === "salesManagerName"){
                            e.isHidden = false;
                        }
                        return e;
                    })
                }

                temp.totalCount  = response.data.count;

                this.setState({
                    datagridProps: temp
                })
                // this.getSalesManager();
                
            } else if (response.status == 401) {
                console.log("User not exist");
            } else {
                console.log('Error found : ', response.data.message);
            }
        }).catch((error)=>{
            console.log('Error found : ', error);
        });
    }
    
    createLead = (data) => {
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        if(user.userType !== "admin") {
            data.salesManagerName = user.user.id;
        }

        moment(data.virtualMeetTime).format('YYYY-MM-DDTHH:MM:SSZ') // working partially
        axios({
            method: 'post',
            url: getAPIs().lead,
            data: {
                    "user": {
                        userType:user.userType
                    },
                    "data": {
                        "fullName": data.fullName,
                        "mobileNumber": data.mobileNumber,
                        "dob": new Date(data.dob).getTime(),
                        "emailId": data.emailId,
                        "message": data.message,
                        "virtualMeetTime": new Date(data.virtualMeetTime).getTime(),
                        "budget": numeral(data.budget)._value,
                        "preference": data.preference,
                        "projectId": data.projectName,
                        "salesManagerId": data.salesManagerName,
                        "brokerId": data.brokerName,
                        "configuration": data.configuration,
                        "purchasePurpose": data.purchasePurpose,
                        "occupation": data.occupation,
                        "leadSource": data.leadSource,
                        "status": data.status,
                        "partnerName": localStorage.getItem('partner')
                    }
            }
        }).then((response) => {
            if (response.status == 200){
                console.log('Lead added');
                this.getLead(0);
            } else if (response.status == 500) {
                console.log("Add Lead failed ", response.message);
            }else if (response.status == 401) {
                console.log("User not exist");
            } else {
                console.log('Error found : ', response.data.message);
            }
        }).catch((error)=>{
            console.log('Error found : ', error);
        });
    }

    updateLead = (data) => {
        let temp = JSON.parse(localStorage.getItem('loggedInUser'));

        axios({
            method: 'put',
            url: getAPIs().lead,
            data: {
                    "user": {
                        userType:temp.userType
                    },
                    "data": {
                        "id": data.id,
                        "fullName": data.fullName,
                        "mobileNumber": data.mobileNumber,
                        "emailId": data.emailId,
                        "message": data.message,
                        "budget": numeral(data.budget)._value,
                        "preference": data.preference,
                        "configuration": data.configuration,
                        "purchasePurpose": data.purchasePurpose,
                        "occupation": data.occupation,
                        "leadSource": data.leadSource,
                        "status": data.status,
                        "dob": new Date(data.dob).getTime()
                    }
            }
        }).then((response) => {
            if (response.status == 200){
                console.log('User updated');
                this.getLead(0);
            } else if (response.status == 401) {
                console.log("User not exist");
            } else {
                console.log('Error found : ', response.data.message);
            }
        }).catch((error)=>{
            console.log('Error found : ', error);
        });
    }

    getProjects = () => {
        let params = {
            filter: {
                "partnerName": localStorage.getItem('partner')
            }
        };

        axios({
            method: 'get',
            url: getAPIs().project,
            params: params
        }).then((response) => {
            if (response.status == 200){
                console.log('User fetched', response.data); 
                
                localStorage.setItem("projects",JSON.stringify(response.data.data));

                // this.setState({
                //     datagridProps: temp
                // })
                // this.getSalesManager();
                
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

export default withRouter(Leads);