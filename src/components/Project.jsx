import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import ImagePreviewList from './ImagePreviewList';
import { uploadFileToS3 } from '../utils/aws/react-s3';
import FormControl from '../components/form-input/FormControl';
import axios from 'axios';
import { getAPIs, getPresetAmenitiesList} from '../utils/constants';
import { isImageFile, isPDF_File, getFileExtension} from '../utils/commonMethods';
import SectionContainer from '../components/SectionContainer';
import BrowseFilesContainer from '../components/BrowseFilesContainer';
import lodashClonedeep from 'lodash.clonedeep';

class ProjectItem extends Component {
    constructor(props){
        super(props);

        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        this.state = {
            user : user,
            project : {}, 
            presetAmenities : getPresetAmenitiesList(), 
            banner : {id : "banner", title : "Home", images : [], files : []},
            about : { id: "about", title : "", description : "", brochureLink : "" , brochureFile : {}},
            amenities : { 
                            id: "amenities", title : "Amenities",
                            list : [{
                                  tourImageLink : "", tourLink : ""
                                }], 
                            files : [{
                                    tourImageFile : {}, tourLink : ""
                                }]
                        },
            virtualTour : { id: "virtualTour", title : "Virtual Tour", list : [], files : []},
            gallery : { id: "gallery", title : "Gallery", images : [], files : []},
            floorPlans : { id: "floorPlans", title : "Floor Plans", images : [], files : []},
            contactUs : { id: "contactUs", title : "Contact Us", mapLink : ""},
            footer : { id: "footer", title : "Footer", description : "", disclaimer : ""}
        };
        this.getProjectById(this.props.data);
    }

    componentWillReceiveProps(nextProps) {
        this.getProjectById(nextProps.data);
      }

    getProjectById = (projectId) => {
        const user = lodashClonedeep(this.state.user);
        const filteredProjects = user.projects.filter(project => project.id == projectId);
        const projectObj = filteredProjects.length > 0 ? filteredProjects[0] : {};
        const obj = { project : projectObj };
        if(Object.keys(projectObj).length > 0){
            const sectionArr = lodashClonedeep(projectObj.websiteMenus.sections);
            for (let index = 0; index < sectionArr.length; index++) {
                const section = sectionArr[index];
                if(section.id){
                    // let temp = obj[section.id];
                    // console.log(temp)
                    // console.log(section)
                    obj[section.id] = section;
                    // obj[section.id] = Object.assign(this.state[section], section) ;
                    if(section.id == "banner" || section.id == "gallery" || section.id == "floorPlans" || section.id == "amenities"){
                        obj[section.id].files = [];
                    } else if(section.id == "about"){
                        obj[section.id].brochureFile = {};
                    } else if(section.id == "virtualTour"){
                        obj[section.id].files = [];
                        if(obj[section.id].list == undefined){
                            obj[section.id].list = []
                        }
                    }
                }
            } 
        }
        this.setState(obj);
    }

    uploadFiles = (section) => {
        const directoryName = this.state.project.partnerName + "_" + this.state.project.projectName + "/" + section;
        const sectionObj = lodashClonedeep(this.state[section]);
        switch (section) {
            case 'banner':  
            case 'amenities':
            case 'gallery':
            case 'floorPlans':
                if(sectionObj.files.length > 0){
                    sectionObj.files.forEach((file, index) => {
                        uploadFileToS3(file, directoryName).then(data => {
                            console.log("upload response ",data);
                            sectionObj.images.push(data.location);
                            sectionObj.files.splice(index, 1);
                            const inputData = {};
                            inputData[section] = sectionObj;
                            this.setState(inputData);
                            this.updateProjectInfo(undefined, section);
                        }).catch(err => {
                            console.error("upload errr ",err)
                        });
                    });
                } else {
                    this.updateProjectInfo(undefined, section);
                }
                break;

            case 'about':
                if(this.getIsBrochureSelected()){
                    uploadFileToS3(sectionObj.brochureFile, directoryName).then(data => {
                        sectionObj.brochureLink = data.location;
                        sectionObj.brochureFile = {};
                        const inputData = {};
                        inputData[section] = sectionObj;
                        this.setState(inputData);
                        this.updateProjectInfo(undefined, section);
                    }).catch(err => {
                        console.error("upload errr ",err)
                    });
                } else {
                    this.updateProjectInfo(undefined, section);
                }
                break;

            case 'virtualTour':
                if(sectionObj.files.length > 0){
                    sectionObj.files.forEach((fileObj, index) => {
                        // fileObj.tourImageFile.name = (this.state.virtualTour.list.length + 1) + getFileExtension(fileObj.tourImageFile);
                        uploadFileToS3(fileObj.tourImageFile, directoryName, index).then(data => {
                            console.log("upload response ", data.index, " ",data);
                            console.log(sectionObj.files)
                            sectionObj.list.push({tourImageLink : data.location, tourLink : sectionObj.files[data.index].tourLink});
                            sectionObj.files.splice(data.index, 1);
                            const inputData = {};
                            inputData[section] = sectionObj;
                            this.setState(inputData);
                            this.updateProjectInfo(undefined, section);
                        }).catch(err => {
                            console.error("upload errr ",err)
                        });
                    });
                } else {
                    this.updateProjectInfo(undefined, section);
                }
                break;
        
            default:
                break;
        }
    }

    render(){
        console.log(this.state.virtualTour)
        const {project, presetAmenities, banner, about, amenities, virtualTour, gallery, floorPlans, contactUs, footer} =  this.state;
        const sectionContainer = { width: 'inherit' };
        const autoMargin = {margin: 'auto'}
        const fitContentWidth = {width : 'fit-content', float : 'left'};
        
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

                                                <BrowseFilesContainer onDropFiles={(files) => this.processFile(files, 'banner')} />
                                                <div style={{margin:'auto'}}>{banner.files.length} Banners Selected</div>
                                                     
                                                <ImagePreviewList 
                                                    imageLinks={banner.images} 
                                                    imageFiles={banner.files} 
                                                    onRemoveImageFile={(data) => this.removeNonUploadedImage(data, 'banner')}
                                                    onRemoveImageLink={(data) => this.removeUploadedImage(data, 'banner')} 
                                                />

                                                <div style={{margin : '15px'}}>
                                                    <button className="btn btn-primary mr-2" onClick={(e) =>  {e.preventDefault(); this.uploadFiles('banner')}}>Upload</button>
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

                                                            <BrowseFilesContainer onDropFiles={(files) => this.processFile(files, 'about')} />
                                                            <div style={{margin:'auto'}}>{about.brochureLink !== "" ? 1 : 0} Brochure uploaded { this.getIsBrochureSelected() ? 1 : 0 } Brochure Selected</div>
                                                        </div>
                                                        
                                                    )}
                                                    
                                                    <div style={{margin : '15px'}}>
                                                        <button className="btn btn-primary mr-2" onClick={(e) =>  {e.preventDefault(); this.uploadFiles('about')}}>Upload</button>
                                                    </div>
                                                    <div style={{margin : '15px'}}>
                                                        <button className="btn btn-primary mr-2" onClick={(e) => this.updateProjectInfo(e, 'about')}>SAVE</button>
                                                        <button className="btn btn-dark" type="button" >CANCEL</button>
                                                    </div> 
                                                </form>   
                                            </SectionContainer>
                                            
                                            <SectionContainer className={sectionContainer} displayTitle="Amenities">
                                                    {(
                                                        presetAmenities.map((amenity, index) => {
                                                            return <FormControl key={index}
                                                                        name={'amenities'+index}
                                                                        type="checkbox" 
                                                                        value={amenities.list}
                                                                        id={'amenities'+index}
                                                                        onChange={(e) => this.onChangeHandler(e, 'amenities')} 
                                                                        className="form-control" 
                                                                        placeholder={amenity.title}
                                                                        style={fitContentWidth}
                                                                    />
                                                        })
                                                    )} 
                                                    <br/>
                                                    <BrowseFilesContainer onDropFiles={(files) => this.processFile(files, 'amenities')} />
                                                    <div style={{margin:'auto'}}>{amenities.files.length} Amenity Photos Selected</div>
                                                        
                                                    <ImagePreviewList 
                                                        imageLinks={amenities.images} 
                                                        imageFiles={amenities.files} 
                                                        onRemoveImageFile={(data) => this.removeNonUploadedImage(data, 'amenities')}
                                                        onRemoveImageLink={(data) => this.removeUploadedImage(data, 'amenities')} 
                                                    />    

                                                    <div style={{margin : '15px'}}>
                                                        <button className="btn btn-primary mr-2" onClick={(e) =>  {e.preventDefault(); this.uploadFiles('amenities')}}>Upload</button>
                                                    </div>
                                            </SectionContainer>

                                            <SectionContainer class={sectionContainer} displayTitle="Virtual Tour"> 
                                                <div>
                                                    <label className="col-sm-auto col-form-label">Virtual Tour Photo</label>
                                                    <BrowseFilesContainer onDropFiles={(files) => this.processFile(files, 'virtualTour')} />
                                                    <div style={{margin:'auto'}}>{virtualTour.files.length} Photos Selected</div>
                                                    {/* <ImagePreviewList 
                                                        images={[virtualTour.imageLink]} 
                                                        imageFiles={virtualTour.files}
                                                        onUpdate={(data) => this.removeNonUploadedImage(data, 'virtualTour')}/> */}
                                                </div>
                                                <div>
                                                    <label className="col-sm-auto col-form-label">Add links of Virtual Tour here</label>
                                                    {(
                                                        virtualTour.list.map((tourObj, index) => {
                                                            return <div className="col-sm-9" key={index} style={{ margin: '5px auto'}}>
                                                               <FormControl 
                                                                    name={"tourLink"+index}
                                                                    type="text" 
                                                                    value={tourObj.tourLink}
                                                                    id={"tourLink"+index}
                                                                    onChange={(e) => this.onChangeListObjHandler(e, 'virtualTour', 'list')} 
                                                                    className="form-control" 
                                                                    placeholder={"Virtual tour link for photo " + (index + 1)}
                                                                    required="true"
                                                                />
                                                            </div>
                                                        })
                                                    )}
                                                    {(
                                                        virtualTour.files.map((imgFile, index) => {
                                                            return <div className="col-sm-9" key={index} style={{ margin: '5px auto'}}>
                                                               <FormControl 
                                                                    name={"tourLink"+index}
                                                                    type="text" 
                                                                    value={imgFile.tourLink}
                                                                    id={"tourLink"+index}
                                                                    onChange={(e) => this.onChangeListObjHandler(e, 'virtualTour', 'files')} 
                                                                    className="form-control" 
                                                                    placeholder={"Virtual tour link for photo " + (index + 1)}
                                                                    required="true"
                                                                />
                                                            </div>
                                                        })
                                                    )}
                                                </div>

                                                <div style={{margin : '15px'}}>
                                                    <button className="btn btn-primary mr-2" onClick={(e) =>  {e.preventDefault(); this.uploadFiles('virtualTour')}}>Upload</button>
                                                </div>
                                            </SectionContainer>

                                            <SectionContainer class={sectionContainer} displayTitle="Gallery"> 

                                                <BrowseFilesContainer onDropFiles={(files) => this.processFile(files, 'gallery')} />
                                                <div style={{margin:'auto'}}>{gallery.files.length} Photos Selected</div>

                                                <ImagePreviewList 
                                                    imageLinks={gallery.images} 
                                                    imageFiles={gallery.files} 
                                                    onRemoveImageFile={(data) => this.removeNonUploadedImage(data, 'gallery')}
                                                    onRemoveImageLink={(data) => this.removeUploadedImage(data, 'gallery')} 
                                                />

                                                <div style={{margin : '15px'}}>
                                                    <button className="btn btn-primary mr-2" onClick={(e) =>  {e.preventDefault(); this.uploadFiles('gallery')}}>Upload</button>
                                                </div>
                                            </SectionContainer>
                                            
                                            <SectionContainer class={sectionContainer} displayTitle="Floor Plans"> 

                                                <BrowseFilesContainer onDropFiles={(files) => this.processFile(files, 'floorPlans')} />
                                                <div style={{margin:'auto'}}>{floorPlans.files.length} Floor Plans Selected</div>

                                                <ImagePreviewList 
                                                    imageLinks={floorPlans.images} 
                                                    imageFiles={floorPlans.files} 
                                                    onRemoveImageFile={(data) => this.removeNonUploadedImage(data, 'floorPlans')}
                                                    onRemoveImageLink={(data) => this.removeUploadedImage(data, 'floorPlans')} 
                                                />

                                                <div style={{margin : '15px'}}>
                                                    <button className="btn btn-primary mr-2" onClick={(e) =>  {e.preventDefault(); this.uploadFiles('floorPlans')}}>Upload</button>
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

    processFile = (files, section) => {
        console.log(files)
        switch (section) {
            case 'banner':  
            case 'amenities':
            case 'gallery':
            case 'floorPlans':
                if(files.length > 0){
                    Array.from(files).forEach(file => {
                        const isImage = isImageFile(file);
                        if(isImage){
                            const newSectionObj = this.state[section];
                            const newFiles = newSectionObj.files;
                            newFiles.push(file);
                            newSectionObj.files = newFiles;

                            const inputData = {};
                            inputData[section] = newSectionObj;
                            this.setState(inputData);
                        }
                    });
                }
                break;

            case 'virtualTour':
                if(files.length > 0){
                    Array.from(files).forEach(file => {
                        const isImage = isImageFile(file);
                        if(isImage){
                            const newSectionObj = this.state[section];
                            const newFiles = newSectionObj.files;
                            newFiles.push({tourImageFile : file, tourLink : "" });
                            newSectionObj.files = newFiles;

                            const inputData = {};
                            inputData[section] = newSectionObj;
                            this.setState(inputData);
                        }
                    });
                }
                break;

            case 'about':
                if(files.length > 0){
                    const file = files[0];
                    const isPDF = isPDF_File(file);
                    if(isPDF){
                        const newSectionObj = this.state[section];
                        newSectionObj.brochureFile = file;
                        const inputData = {};
                        inputData[section] = newSectionObj;
                        this.setState(inputData);
                    }
                }
                break;
        
            default:
                break;
        }
    }

    removeNonUploadedImage = (data, section) => {
        const newSectionObj = this.state[section];
        const filteredFiles = newSectionObj.files.filter((img) => {
            return img.name !== data.name;
        })
        newSectionObj.files = filteredFiles;
        const inputData = {};
        inputData[section] = newSectionObj;
        this.setState(inputData);
    }

    removeUploadedImage = (data, section) => {
        const newSectionObj = this.state[section];
        const filteredImgLinks = newSectionObj.images.filter((img) => {
            return img !== data;
        })
        newSectionObj.images = filteredImgLinks;
        const inputData = {};
        inputData[section] = newSectionObj;
        this.setState(inputData);
    }

    onChangeHandler = (e, section) => {
        const inputData = {}
        inputData[section] = this.state[section];
        inputData[section][e.target.name] = e.target.value;
        this.setState(inputData);
    }

    onChangeListObjHandler = (e, section , sectionKey) => {
        const inputData = {}
        inputData[section] = this.state[section];
        if(section == "virtualTour"){
            let index = e.target.name.replace('tourLink', '');
            console.log(index);
            console.log(e.target.name);
            console.log(inputData[section][sectionKey][index])
            inputData[section][sectionKey][index].tourLink = e.target.value;
        }
        
        
        this.setState(inputData);
    }

    updateProjectInfo = (e, section) => {
        if(e !== undefined){
            e.preventDefault();
        }
        let user = JSON.parse(localStorage.getItem('loggedInUser'));
        const updatedProject = this.getUpdatedProject(section, this.state[section]);
        console.log('updatedProject ',updatedProject);
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
        const project = lodashClonedeep(this.state.project);
        const updatedSection = this.state[section];
        const oldSectionArr = project.websiteMenus.sections;
        let newSectionArr = oldSectionArr.map((oldSection) => {
            if(oldSection.id == section) {
                if(updatedSection.files) delete updatedSection.files;
                if(updatedSection.brochureFile) delete updatedSection.brochureFile;
                return updatedSection;
            }
            else return oldSection;
        })
        project.websiteMenus.sections = newSectionArr;
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

    getIsBrochureSelected = () => {
        if("name" in this.state.about.brochureFile) return true;
        else return false;
    }
    
}





export default withRouter(ProjectItem);