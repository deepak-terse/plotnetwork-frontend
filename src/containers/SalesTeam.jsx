import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import '../styles/Home.module.scss';
import SidePanel from '../components/SidePanel';
import Datagrid from '../components/Datagrid';
import Backdrop from '../components/Backdrop';

import sidePanelData from '../data/salesteam-sidepanel.json';
import datagridData from '../data/salesteam-datagrid.json';

class SalesTeam extends Component {
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

export default withRouter(SalesTeam)
