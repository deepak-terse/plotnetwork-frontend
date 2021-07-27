import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import '../styles/Home.module.scss';
import SidePanel from '../components/SidePanel';
import Datagrid from '../components/Datagrid';
import Backdrop from '../components/Backdrop';

import sidePanelData from '../data/brokers-sidepanel.json';
import datagridData from '../data/brokers-datagrid.json';

class Brokers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            drawerOpen: false,
            datagridProps: datagridData,
            SidePanelProps: sidePanelData
        }
    }

    onAddHandler = () => {
        sidePanelData.fields[0].value = "";
        sidePanelData.fields[1].value = "";
        sidePanelData.fields[2].value = "";
        sidePanelData.fields[3].value = "";
        sidePanelData.fields[4].value = "";
        sidePanelData.fields[5].value = "";
        sidePanelData.fields[6].value = "";
        this.setState({
            SidePanelProps: sidePanelData,
            drawerOpen: true
        })
    }

    onUpdateHandler = (data) => {
        let SPProps = sidePanelData;
        SPProps.fields[0].value = data.name;
        SPProps.fields[1].value = data.salesManager;
        SPProps.fields[2].value = data.companyName;
        SPProps.fields[3].value = data.reraNumber;
        SPProps.fields[4].value = data.mobileNumber;
        SPProps.fields[5].value = data.address;
        SPProps.fields[6].value = data.email;
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
}

export default withRouter(Brokers);

//Data
// const SidePanelData = {
//     title: "Brokers Add Form",
//     subtitle: "Fill the below form to add new Broker",
//     fields: [
//         {
//             id: "name",
//             label: "Full Name",
//             type: "text",
//             value: "",
//             placeholder: "Deepak Terse",
//             hidden: false,
//             disabled: false
//         },
//         {
//             id: "mobile",
//             label: "Mobile Number",
//             type: "text",
//             value: "",
//             placeholder: "8888888888",
//             hidden: false,
//             disabled: false
//         },
//         {
//             id: "email",
//             label: "Email ID",
//             type: "text",
//             value: "",
//             placeholder: "deepak@gmail.com",
//             hidden: false,
//             disabled: false
//         }
//     ]
// }

// const datagridData = {
//     title: "Brokers List",
//     tableHeaders: [
//         { key:"name", label:"Name" },
//         { key:"mobilenumber", label:"Mobile Number"},
//         { key:"email", label:"Email ID"}
//     ],
//     tableData: [
//         {
//             "name": "Deepak Terse",
//             "mobilenumber": "8097872267",
//             "email": "deepak@gmail.com"
//         }
//     ],
//     buttons: [
//         {
//             label:  "Add Broker"
//         }
//     ]
// }
