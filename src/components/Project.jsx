import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import ImagePreviewList from './ImagePreviewList';
import { uploadFileToS3 } from '../utils/aws/react-s3';
import FormControl from '../components/form-input/FormControl';
import axios from 'axios';
import { getAPIs } from '../utils/constants';
import { isImageFile } from '../utils/commonMethods';
import SectionContainer from '../components/SectionContainer';
import BrowseFilesContainer from '../components/BrowseFilesContainer';

class ProjectItem extends Component {
    constructor(props){
        super(props);

        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        this.state = {
            user : user,
            project : {}, 
            banner : {id : "banner", title : "Home", images : []},
            about : { id: "about", title : "", description : "" },
            amenities : { id: "amenities", title : "Amenities", list : []},
            virtualTour : { id: "virtualTour", title : "Virtual Tour", imageLink : "", link : ""},
            gallery : { id: "gallery", title : "Gallery", list : []},
            floorPlans : { id: "floorPlans", title : "Floor Plans", list : []},
            contactUs : { id: "contactUs", title : "Contact Us", mapLink : ""},
            footer : { id: "footer", title : "Footer", description : "", disclaimer : ""}
        };
        this.getProjectById(this.props.data);
    }

    componentWillReceiveProps(nextProps) {
        this.getProjectById(nextProps.data);
      }

    getProjectById = (projectId) => {
        const user = this.state.user;
        const filteredProjects = user.projects.filter(project => project.id == projectId);
        const projectObj = filteredProjects.length > 0 ? filteredProjects[0] : {};
        const obj = { project : projectObj };
        if(Object.keys(projectObj).length > 0){
            const sectionArr = projectObj.websiteMenus.sections;
            for (let index = 0; index < sectionArr.length; index++) {
                const section = sectionArr[index];
                if(section.id){
                    obj[section.id] = section
                }
            } 
        }
        this.setState(obj);
    }

    uploadHomeImages = () => {
        const directoryName = this.state.project.partnerName + "_" + this.state.project.projectName;
        this.state.banner.images.forEach(file => {
            this.uploafFile(file, directoryName);
        });
    }

    uploafFile = (file, directoryName) => {
        uploadFileToS3(file, directoryName).then(data => {
            console.log("upload response ",data)
        }).catch(err => {
            console.error("upload errr ",err)
        });
    }

    render(){
        const {project, banner, about, amenities, virtualTour, gallery, floorPlans, contactUs, footer} =  this.state;
        const sectionContainer = { width: 'inherit' };
        const autoMargin = {margin: 'auto'}

        return (
            <div className="row">
                    <div className="col-lg-12 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                {(
                                    project.id ?
                                    (
                                        <div >
                                            <h4 className="card-title">{project.projectName}</h4>
                                            <SectionContainer class={sectionContainer} displayTitle="Home"> 
                                                <BrowseFilesContainer onDropFiles={this.processFile} />
                                                <div style={{margin:'auto'}}>{this.state.banner.images.length} Banners Selected</div>
                                                <ImagePreviewList images={this.state.banner.images} onUpdate={this.onListUpdatehandler}/>

                                                <div style={{margin : '15px'}}>
                                                    <button className="btn btn-primary mr-2" onClick={(e) =>  {e.preventDefault(); this.uploadHomeImages()}}>Upload</button>
                                                </div>
                                            </SectionContainer>
                                            
                                            <SectionContainer className={sectionContainer} displayTitle="About Us"> 
                                                <form className="forms-sample" name="aboutSectionForm" id="aboutSectionForm">
                                                    {(
                                                        <div>
                                                            <label htmlFor="aboutTitle" className="col-sm-auto col-form-label">Title</label>
                                                            <div className="col-sm-9" style={autoMargin}>
                                                                <FormControl
                                                                    name="title"
                                                                    type="text" 
                                                                    value={about.title}
                                                                    id="aboutTitle"
                                                                    onChange={(e) => this.onChangeHandler(e, 'about')} 
                                                                    className="form-control" 
                                                                    placeholder=""
                                                                    required="true"
                                                                />
                                                            </div>

                                                            <label htmlFor="aboutDescription" className="col-sm-auto col-form-label">Description</label>
                                                            <div className="col-sm-9" style={autoMargin}>
                                                                <FormControl
                                                                    name="description"
                                                                    type="textarea" 
                                                                    value={about.description}
                                                                    id="aboutDescription"
                                                                    rows="5"
                                                                    onChange={(e) => this.onChangeHandler(e, 'about')} 
                                                                    className="form-control" 
                                                                    placeholder=""
                                                                    required="true"
                                                                />
                                                            </div>
                                                        </div>
                                                        
                                                    )}
                                                        
                                                    <div style={{margin : '15px'}}>
                                                        <button className="btn btn-primary mr-2" onClick={(e) => this.updateProjectInfo(e, 'about')}>SAVE</button>
                                                        <button className="btn btn-dark" type="button" >CANCEL</button>
                                                    </div> 
                                                </form>   
                                            </SectionContainer>
                                            
                                            {/* <SectionContainer className={sectionContainer} displayTitle="Amenities">

                                            </SectionContainer> */}
                                            <SectionContainer class={sectionContainer} displayTitle="Virtual Tour"> 
                                                <div>
                                                    <label htmlFor="aboutTitle" className="col-sm-auto col-form-label">Virtual Tour Photo</label>
                                                    <BrowseFilesContainer onDropFiles={this.processFile} />
                                                    <div style={{margin:'auto'}}>{this.state.banner.images.length} Photos Selected</div>
                                                    <ImagePreviewList images={this.state.banner.images} onUpdate={this.onListUpdatehandler}/>
                                                </div>
                                                <div>
                                                    <label htmlFor="aboutTitle" className="col-sm-auto col-form-label">Virtual Tour Video</label>
                                                    <BrowseFilesContainer onDropFiles={this.processFile} />
                                                    <div style={{margin:'auto'}}>{this.state.banner.images.length} Tour Selected</div>
                                                    <ImagePreviewList images={this.state.banner.images} onUpdate={this.onListUpdatehandler}/>
                                                </div>

                                                <div style={{margin : '15px'}}>
                                                    <button className="btn btn-primary mr-2" onClick={(e) =>  {e.preventDefault(); this.uploadHomeImages()}}>Upload</button>
                                                </div>
                                            </SectionContainer>

                                            <SectionContainer class={sectionContainer} displayTitle="Gallery"> 
                                                <BrowseFilesContainer onDropFiles={this.processFile} />
                                                <div style={{margin:'auto'}}>{this.state.banner.images.length} Photos Selected</div>
                                                <ImagePreviewList images={this.state.banner.images} onUpdate={this.onListUpdatehandler}/>

                                                <div style={{margin : '15px'}}>
                                                    <button className="btn btn-primary mr-2" onClick={(e) =>  {e.preventDefault(); this.uploadHomeImages()}}>Upload</button>
                                                </div>
                                            </SectionContainer>
                                            
                                            <SectionContainer class={sectionContainer} displayTitle="Floor Plans"> 
                                                <BrowseFilesContainer onDropFiles={this.processFile} />
                                                <div style={{margin:'auto'}}>{this.state.banner.images.length} Floor Plans Selected</div>
                                                <ImagePreviewList images={this.state.banner.images} onUpdate={this.onListUpdatehandler}/>

                                                <div style={{margin : '15px'}}>
                                                    <button className="btn btn-primary mr-2" onClick={(e) =>  {e.preventDefault(); this.uploadHomeImages()}}>Upload</button>
                                                </div>
                                            </SectionContainer>

                                            <SectionContainer className={sectionContainer} displayTitle="Contact Us"> 
                                                <form className="forms-sample" name="contactSectionForm" id="contactSectionForm">
                                                    {(
                                                        <div>
                                                            <label htmlFor="contactUs" className="col-sm-auto col-form-label">Add link of location map here</label>
                                                            <div className="col-sm-9" style={autoMargin}>
                                                                <FormControl
                                                                    name="mapLink"
                                                                    type="text" 
                                                                    value={contactUs.mapLink}
                                                                    id="contactUs"
                                                                    rows="5"
                                                                    onChange={(e) => this.onChangeHandler(e, 'contactUs')} 
                                                                    className="form-control" 
                                                                    placeholder=""
                                                                    required="true"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                        
                                                    <div style={{margin : '15px'}}>
                                                        <button className="btn btn-primary mr-2" onClick={(e) => this.updateProjectInfo(e, 'contactUs')}>SAVE</button>
                                                        <button className="btn btn-dark" type="button" >CANCEL</button>
                                                    </div>
                                                </form>   
                                            </SectionContainer>

                                            <SectionContainer className={sectionContainer} displayTitle="Footer"> 
                                                <form className="forms-sample" name="footerSectionForm" id="footerSectionForm">
                                                    {(
                                                        <div>
                                                            <label htmlFor="footer" className="col-sm-auto col-form-label">Add footerline for your website</label>
                                                            <div className="col-sm-9" style={autoMargin}>
                                                                <FormControl
                                                                    name="description"
                                                                    type="textarea" 
                                                                    value={footer.description}
                                                                    id="footer"
                                                                    rows="5"
                                                                    onChange={(e) => this.onChangeHandler(e, 'footer')} 
                                                                    className="form-control" 
                                                                    placeholder=""
                                                                    required="true"
                                                                />
                                                            </div>

                                                            <label htmlFor="disclaimer" className="col-sm-auto col-form-label">Disclaimer</label>
                                                            <div className="col-sm-9" style={autoMargin}>
                                                                <FormControl
                                                                    name="disclaimer"
                                                                    type="textarea" 
                                                                    value={footer.disclaimer}
                                                                    id="disclaimer"
                                                                    rows="5"
                                                                    onChange={(e) => this.onChangeHandler(e, 'footer')} 
                                                                    className="form-control" 
                                                                    placeholder=""
                                                                    required="true"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                        
                                                    <div style={{margin : '15px'}}>
                                                        <button className="btn btn-primary mr-2" onClick={(e) => this.updateProjectInfo(e, 'footer')}>SAVE</button>
                                                        <button className="btn btn-dark" type="button" >CANCEL</button>
                                                    </div>
                                                </form>   
                                            </SectionContainer>                                        
                                        </div>
                                        
                                    ) : ''
                                )}
                            </div>
                        </div>
                    </div>                    
                </div>

        )
    }

    processFile = (files) => {
        if(files.length > 0){
            Array.from(files).forEach(file => {
                const isImage = isImageFile(file);
                if(isImage){
                    const newBanner = this.state.banner;
                    const files = newBanner.images;
                    files.push(file);
                    newBanner.images = files
                    this.setState({banner : newBanner});
                }
            });
        }
    }

    onListUpdatehandler = (data) => {
        const newBanner = this.state.banner;
        const filteredFiles = newBanner.images.filter((file) => {
            return file.name !== data.name;
        })
        newBanner.images = filteredFiles;
        this.setState({banner : newBanner})
    }

    onChangeHandler = (e, section) => {
        const inputData = {}
        inputData[section] = this.state[section];

        inputData[section][e.target.name] = e.target.value;
        this.setState(inputData);
    }

    updateProjectInfo = (e, section) => {
        e.preventDefault();
        let user = JSON.parse(localStorage.getItem('loggedInUser'));
        const updatedProject = this.getUpdatedProject(section, this.state[section]);
        
        axios({
            method: 'put',
            url: getAPIs().project,
            data: {
                    "user": {
                        userType:user.userType
                    },
                    "data": {
                        "id" : updatedProject.id,  
                        "websiteMenus" : updatedProject.websiteMenus
                    }
            }
        }).then((response) => {
            if (response.status == 200){
                console.log('project updated ',response);
                if(response.data){
                    this.setState({ project : response.data.data[0]});
                    this.saveProjectInLocalStorage(response.data.data[0]);
                }
            } else if (response.status == 401) {
                console.log("project not exist");
            } else {
                console.log('Error found : ', response.data.message);
            }
        }).catch((error)=>{
            console.log('Error found : ', error);
        });
    }

    getUpdatedProject = (section, data) => {
        const project = this.state.project;
        const sections = project.websiteMenus.sections;
        project.websiteMenus.sections = [
            this.state.banner, this.state.about, this.state.amenities, this.state.virtualTour, this.state.gallery,
             this.state.floorPlans, this.state.contactUs, this.state.footer
        ]
        // switch (section) {
        //     case 'about':
                
        //         if(sections.length)
        //         sections.splice(1,0,data);
        //         project.websiteMenus.sections = sections;
        //         break;
            
        //     case 'contactUs':
        //         sections.push(data);
        //         project.websiteMenus.sections = sections;
        //         break;

        //     case 'footer':
        //         sections.push(data);
        //         project.websiteMenus.sections = sections;
        //         break;
                            
        //     default:
        //         break;
        // }

        return project;
    }

    saveProjectInLocalStorage = (data) => {
        const user = this.state.user;
        const updatedProjects = user.projects.map(project => {
            if(project.id == data.id){
                return data;
            }
            return project;
        });
        user.projects = updatedProjects;
        localStorage.setItem('loggedInUser', JSON.stringify(user));
    }
}





export default withRouter(ProjectItem);