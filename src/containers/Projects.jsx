import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import projectDataGrid from '../data/projects-datagrid.json';
import { Form } from 'react-bootstrap';
// import FormControl from '../components/form-input/FormControl';
import SelectInput from '../components/form-input/SelectInput';
import styles from '../styles/FormInput.module.scss';
import ProjectItem from '../components/Project';

class Projects extends Component {
    constructor(props){
        super(props);
       
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        this.state = {
            projects : user.projects,
            projectId : '',
            projectSelected : {}
        };
    }

    onChangeHandler = (e) => {
        const filteredProjects = this.state.projects.filter(project => project.id == e.target.value); 
        const projectObj = filteredProjects.length > 0 ? filteredProjects[0] : {};
        this.setState({ projectId : e.target.value, projectSelected : projectObj });
    }

    render(){
        const { projects, projectId, projectSelected} = this.state;

        return (
            <div>
                <div className="row" style={projects.length == 0 ? {display:'none'} : {}} >
                    <div className="col-lg-12 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Filters</h4>
                                <div className="table-responsive">
                                    <form className="forms-sample form-inline">
                                        {(
                                            <Form.Group>
                                                <label className="col-sm-3 col-form-label">Projects</label>
                                                <div className="col-sm-3">
                                                {
                                                    <select name ="projects"
                                                        className={`${styles.input} form-control`}
                                                        value={projectId}
                                                        onChange={this.onChangeHandler}
                                                    >
                                                        <option value="">Select</option>
                                                        {projects.map((option) =>
                                                            <option key={option.id} value={option.id}>{option.projectName}</option>
                                                        )}
                                                    </select> 
                                                }
                                                </div>
                                            </Form.Group> 
                                        )}
                                        
                                        <br/>
                                        <br/>
                                    </form>
                                    
                                </div>
                            </div>
                        </div>
                    </div>                    
                </div>

                <ProjectItem projectSelected={projectSelected} />
                
            </div>
        )
    }
}

export default withRouter(Projects);