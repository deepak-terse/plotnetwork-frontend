import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import ImagePreviewList from './ImagePreviewList';
import { uploadFileToS3 } from '../utils/aws/react-s3';
import FormControl from '../components/form-input/FormControl';
import axios from 'axios';
import { getAPIs, getPresetAmenitiesList, getStaticProcessingSections, getStaticMicrositeSections} from '../utils/constants';
import { isImageFile, isPDF_File, getFileExtension} from '../utils/commonMethods';
import SectionContainer from '../components/SectionContainer';
import BrowseFilesContainer from '../components/BrowseFilesContainer';
import lodashClonedeep from 'lodash.clonedeep';


import styles from '../styles/FileUpload.module.scss';

class ProjectItem extends Component {
    constructor(props){
        super(props);

        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        this.state = {
            user : user,
            project : props.projectSelected, 
            presetAmenities : getPresetAmenitiesList(),
            ...getStaticProcessingSections(),
            getProjectById:this.getProjectById.bind(this)
        };
    }

    componentDidMount(){
        const newState = this.getProjectById(this.props.projectSelected);
        this.setState(newState);
    }

    static getDerivedStateFromProps(props, state) {
        // Get new state wnever props changes
        if (
          props.projectSelected.id !== state.project.id
        ) {
          return state.getProjectById(props.projectSelected);
        }
        return null;
    }

    getProjectById = (projectObj) => {
        const filteredProjects = this.state.user.projects.filter(project => project.id == projectObj.id); 
        projectObj = filteredProjects.length > 0 ? filteredProjects[0] : {};
        // create directoryName for s3
        const directoryName = projectObj.partnerName + "_" + projectObj.projectName + "/";

        let websiteMenus = projectObj.websiteMenus;
        if(typeof websiteMenus !== 'object') projectObj.websiteMenus = {};

        let sectionArray = projectObj.websiteMenus.sections;
        if(!Array.isArray(sectionArray)) projectObj.websiteMenus.sections = new Array();

        if(projectObj.websiteMenus.sections.length == 0){
            let temp = getStaticMicrositeSections();
            projectObj.websiteMenus.sections = Object.values(temp);
        }

        const obj = { 
            project : projectObj,
            directoryName : directoryName,
            ...getStaticProcessingSections()
        };
        
        const sectionArr = projectObj.websiteMenus.sections;
        for (let index = 0; index < sectionArr.length; index++) {
            const section = sectionArr[index];
            if(section.id){
                // merge microsite data received from backend with the default data
                obj[section.id] = Object.assign(obj[section.id], section) ;
            }
        }
        
        return obj;          
    }

    render(){
        const { project, presetAmenities, banner, about, amenities, virtualTour, gallery, floorPlans, contactUs, footer} =  this.state;
        const browseContainer = {width: 'inherit'};
        // const fitContentWidth = {width : 'fit-content', float : 'left', margin: '5px' , height: 'auto'};

        const amenityList = this.getAmenityList();        

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
                                            <SectionContainer class={styles.sectionContainer} displayTitle="Home"> 

                                                <div className={`col-sm-7 ${styles.autoMargin}`}>
                                                    <BrowseFilesContainer 
                                                        onDropFiles={(files) => this.processFile(files, 'banner')}
                                                        css={browseContainer} 
                                                        dropContainerCss={styles.fileDrop}
                                                    >Drop some banners here or click here to browse the banner!</BrowseFilesContainer>
                                                </div>
                                                
                                                <div className={styles.filesLength}>{banner.images.length} Banners Uploaded, {banner.files.length} Banners Selected</div>
                                                     
                                                <ImagePreviewList 
                                                    imageLinks={banner.images} 
                                                    imageFiles={banner.files} 
                                                    onRemoveImageFile={(data) => this.removeNonUploadedImage(data, 'banner')}
                                                    onRemoveImageLink={(data) => this.removeUploadedImage(data, 'banner')} 
                                                />

                                                <div style={{margin : '15px'}}>
                                                    <button className="btn btn-primary mr-2" onClick={(e) =>  {e.preventDefault(); this.uploadFiles('banner')}}>SAVE</button>
                                                    <button className="btn btn-dark mr-2" type="button" onClick={(e) =>  {e.preventDefault(); this.resetSection('banner')}}>RESET</button>
                                                </div>
                                            </SectionContainer>
                                            
                                            <SectionContainer class={styles.sectionContainer} displayTitle="About Us"> 
                                                <form className="forms-sample" name="aboutSectionForm" id="aboutSectionForm">
                                                    {(
                                                        <div>
                                                            <div className={`col-sm-7 ${styles.autoMargin}`}>
                                                                <label htmlFor="aboutTitle" className="col-sm-auto col-form-label">Title</label>
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

                                                            <div className={`col-sm-7 ${styles.autoMargin}`}>
                                                                <label htmlFor="aboutDescription" className="col-sm-auto col-form-label">Description</label>
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

                                                            <div className={`col-sm-7 ${styles.autoMargin}`}>
                                                                <label className="col-sm-auto col-form-label">Project Brochure</label>
                                                                <BrowseFilesContainer 
                                                                    onDropFiles={(files) => this.processFile(files, 'about')} 
                                                                    css={browseContainer} 
                                                                    dropContainerCss={styles.fileDrop}
                                                                >Drop .pdf file here here or click here to browse the file!</BrowseFilesContainer>
                                                            </div>
                                                            
                                                            <div className={styles.filesLength}>{about.brochureLink !== "" ? 1 : 0} Brochure uploaded, { this.getIsBrochureSelected() ? 1 : 0 } Brochure Selected</div>
                                                        </div>
                                                        
                                                    )}

                                                    <div style={{margin : '15px'}}>
                                                        <button className="btn btn-primary mr-2" onClick={(e) =>  {e.preventDefault(); this.uploadFiles('about')}}>SAVE</button>
                                                        <button className="btn btn-dark" type="button" onClick={(e) =>  {e.preventDefault(); this.resetSection('about')}} >RESET</button>
                                                    </div> 
                                                </form>   
                                            </SectionContainer>
                                            
                                            <SectionContainer class={styles.sectionContainer} displayTitle="Amenities">
                                                <div className={`col-sm-7 ${styles.autoMargin}`}>
                                                    <form className="forms-sample" name="amenitySectionForm" id="amenitySectionForm">
                                                        {amenityList}
                                                        <div style={{margin : '15px auto', justifyContent: 'center'}}>
                                                            <button className="btn btn-primary mr-2" onClick={(e) =>  {e.preventDefault(); this.onAddAmenityHandler()}}>
                                                                        Add Amenity
                                                            </button>
                                                                <button className="btn btn-primary mr-2" onClick={(e) =>  {e.preventDefault(); this.uploadAmenityIcons('amenities')}}>SAVE</button>
                                                                <button className="btn btn-dark" type="button" onClick={(e) =>  {e.preventDefault(); this.resetSection('amenities', 'iconFiles')}} >RESET</button>
                                                        </div>
                                                
                                                        {/* <div className="row" style={{minHeight: '80px'}}>
                                                            {(
                                                                presetAmenities.map((amenity, index) => {
                                                                    return <div className="col-sm-auto" style={autoMargin} key={index}>
                                                                                <FormControl 
                                                                                    name={'amenities'+index}
                                                                                    type="checkbox" 
                                                                                    value={amenities.list}
                                                                                    id={'amenities'+index}
                                                                                    onChange={(e) => this.onAmenitiesChange(e, 'amenities')} 
                                                                                    className="form-control" 
                                                                                    placeholder={amenity.title}
                                                                                    styleCSS={fitContentWidth}
                                                                                />
                                                                        </div> 
                                                                })
                                                            )}     
                                                        </div> */}
                                                     
                                                        <br/>
                                                        <BrowseFilesContainer 
                                                            onDropFiles={(files) => this.processFile(files, 'amenities')} 
                                                            css={browseContainer} 
                                                            dropContainerCss={styles.fileDrop}
                                                        >Drop some photos here or click here to browse the photo!</BrowseFilesContainer>
                                                        
                                                        <div className={styles.filesLength}>{amenities.images.length} Amenity Photos Uploaded, {amenities.files.length} Amenity Photos Selected</div>
                                                            
                                                        <ImagePreviewList 
                                                            imageLinks={amenities.images} 
                                                            imageFiles={amenities.files} 
                                                            onRemoveImageFile={(data) => this.removeNonUploadedImage(data, 'amenities')}
                                                            onRemoveImageLink={(data) => this.removeUploadedImage(data, 'amenities')} 
                                                        />    

                                                        <div style={{margin : '15px'}}>
                                                            <button className="btn btn-primary mr-2" onClick={(e) =>  {e.preventDefault(); this.uploadFiles('amenities')}}>SAVE</button>
                                                            <button className="btn btn-dark" type="button" onClick={(e) =>  {e.preventDefault(); this.resetSection('amenities')}} >RESET</button>
                                                        </div>
                                                    </form>
                                                </div>
                                                
                                            </SectionContainer>

                                            <SectionContainer class={styles.sectionContainer} displayTitle="Virtual Tour"> 
                                                <div>
                                                    <div className={`col-sm-7 ${styles.autoMargin}`}>
                                                        <label className="col-sm-auto col-form-label">Virtual Tour Photo</label>
                                                        <BrowseFilesContainer 
                                                            onDropFiles={(files) => this.processFile(files, 'virtualTour')} 
                                                            css={browseContainer} 
                                                            dropContainerCss={styles.fileDrop}
                                                        >Drop some photos here or click here to browse the photo!</BrowseFilesContainer>
                                                    </div>
                                                    
                                                    <div className={styles.filesLength}>{virtualTour.list.length} Photos Uploaded, {virtualTour.files.length} Photos Selected</div>
                                                    {/* <ImagePreviewList 
                                                        images={[virtualTour.imageLink]} 
                                                        imageFiles={virtualTour.files}
                                                        onUpdate={(data) => this.removeNonUploadedImage(data, 'virtualTour')}/> */}
                                                </div>
                                                <div>
                                                    <label className="col-sm-auto col-form-label">Add links of Virtual Tour here</label>
                                                    {(
                                                        virtualTour.list.map((tourObj, index) => {
                                                            return <div className="col-sm-7" key={index} style={{ margin: '5px auto'}}>
                                                               <FormControl 
                                                                    name={"tourLink"+index}
                                                                    type="text" 
                                                                    value={tourObj.tourLink}
                                                                    id={"tourLink"+index}
                                                                    onChange={(e) => this.onChangeVirtualTour(e, 'virtualTour', 'list')} 
                                                                    className="form-control" 
                                                                    placeholder={"Virtual tour link for photo " + (index + 1)}
                                                                    required="true"
                                                                />
                                                            </div>
                                                        })
                                                    )}
                                                    {(
                                                        virtualTour.files.map((imgFile, index) => {
                                                            return <div className="col-sm-7" key={index} style={{ margin: '5px auto'}}>
                                                               <FormControl 
                                                                    name={"tourLink"+index}
                                                                    type="text" 
                                                                    value={imgFile.tourLink}
                                                                    id={"tourLink"+index}
                                                                    onChange={(e) => this.onChangeVirtualTour(e, 'virtualTour', 'files')} 
                                                                    className="form-control" 
                                                                    placeholder={"Virtual tour link for photo " + (index + 1)}
                                                                    required="true"
                                                                />
                                                            </div>
                                                        })
                                                    )}
                                                </div>

                                                <div style={{margin : '15px'}}>
                                                    <button className="btn btn-primary mr-2" onClick={(e) =>  {e.preventDefault(); this.uploadFiles('virtualTour')}}>SAVE</button>
                                                    <button className="btn btn-dark" type="button" onClick={(e) =>  {e.preventDefault(); this.resetSection('virtualTour')}} >RESET</button>
                                                </div>
                                            </SectionContainer>

                                            <SectionContainer class={styles.sectionContainer} displayTitle="Gallery"> 

                                                <div className={`col-sm-7 ${styles.autoMargin}`}>
                                                    <BrowseFilesContainer 
                                                            onDropFiles={(files) => this.processFile(files, 'gallery')} 
                                                            css={browseContainer} 
                                                            dropContainerCss={styles.fileDrop}
                                                    >Drop some photos here or click here to browse the photo!</BrowseFilesContainer>
                                                </div>
                                                
                                                <div className={styles.filesLength}>{gallery.images.length} Photos Uploaded, {gallery.files.length} Photos Selected</div>

                                                <ImagePreviewList 
                                                    imageLinks={gallery.images} 
                                                    imageFiles={gallery.files} 
                                                    onRemoveImageFile={(data) => this.removeNonUploadedImage(data, 'gallery')}
                                                    onRemoveImageLink={(data) => this.removeUploadedImage(data, 'gallery')} 
                                                />

                                                <div style={{margin : '15px'}}>
                                                    <button className="btn btn-primary mr-2" onClick={(e) =>  {e.preventDefault(); this.uploadFiles('gallery')}}>SAVE</button>
                                                    <button className="btn btn-dark" type="button" onClick={(e) =>  {e.preventDefault(); this.resetSection('gallery')}} >RESET</button>
                                                </div>
                                            </SectionContainer>
                                            
                                            <SectionContainer class={styles.sectionContainer} displayTitle="Floor Plans"> 

                                                <div className={`col-sm-7 ${styles.autoMargin}`}>
                                                    <BrowseFilesContainer 
                                                            onDropFiles={(files) => this.processFile(files, 'floorPlans')} 
                                                            css={browseContainer} 
                                                            dropContainerCss={styles.fileDrop}
                                                    >Drop floor plans here or click here to browse the floor plan!</BrowseFilesContainer>
                                                </div>
                                                
                                                <div className={styles.filesLength}>{floorPlans.images.length} Floor Plans Uploaded, {floorPlans.files.length} Floor Plans Selected</div>

                                                <ImagePreviewList 
                                                    imageLinks={floorPlans.images} 
                                                    imageFiles={floorPlans.files} 
                                                    onRemoveImageFile={(data) => this.removeNonUploadedImage(data, 'floorPlans')}
                                                    onRemoveImageLink={(data) => this.removeUploadedImage(data, 'floorPlans')} 
                                                />

                                                <div style={{margin : '15px'}}>
                                                    <button className="btn btn-primary mr-2" onClick={(e) =>  {e.preventDefault(); this.uploadFiles('floorPlans')}}>SAVE</button>
                                                    <button className="btn btn-dark" type="button" onClick={(e) =>  {e.preventDefault(); this.resetSection('floorPlans')}} >RESET</button>
                                                </div>
                                            </SectionContainer>

                                            <SectionContainer class={styles.sectionContainer} displayTitle="Contact Us"> 
                                                <form className="forms-sample" name="contactSectionForm" id="contactSectionForm">
                                                    {(
                                                        <div>
                                                            <div className={`col-sm-7 ${styles.autoMargin}`}>
                                                                <label htmlFor="contactUs" className="col-sm-auto col-form-label">Add link of location map here</label>
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
                                                        <button className="btn btn-dark" type="button" onClick={(e) =>  {e.preventDefault(); this.resetSection('contactUs')}} >RESET</button>
                                                    </div>
                                                </form>   
                                            </SectionContainer>

                                            <SectionContainer class={styles.sectionContainer} displayTitle="Footer"> 
                                                <form className="forms-sample" name="footerSectionForm" id="footerSectionForm">
                                                    {(
                                                        <div>
                                                            <div className={`col-sm-7 ${styles.autoMargin}`}>
                                                                <label htmlFor="footer" className="col-sm-auto col-form-label">Add footerline for your website</label>
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

                                                            <div className={`col-sm-7 ${styles.autoMargin}`}>
                                                                <label htmlFor="disclaimer" className="col-sm-auto col-form-label">Disclaimer</label>
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
                                                        <button className="btn btn-dark" type="button" onClick={(e) =>  {e.preventDefault(); this.resetSection('footer')}} >RESET</button>
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

    getAmenityList = () => {
        const browseContainer = {width: 'inherit'}
        const {amenities} = this.state;

        const amenityUploadedList = amenities.list.map((amenity, index) => {
            return <div className="row">
                        <div className="col-sm-4">
                            <label htmlFor={"amenityTitle"+index} className="col-sm-auto col-form-label">Title</label>
                            <div className={`col-sm-12 ${styles.autoMargin}`}>
                                <FormControl
                                    name={"amenityTitle_list"+index}
                                    type="text" 
                                    value={amenities.list[index].title}
                                    id={"amenityTitle_list"+index}
                                    onChange={(e) => this.onChangeAmenityTitle(e, 'amenities', 'list')}
                                    className="form-control" 
                                    placeholder={"Amenity Title " + (index + 1)}
                                    required={true}
                                />
                            </div>
                        </div>
                        <div className="col-sm-4" style={{verticalAlign: 'middle', margin: 'auto 0'}}>
                            {/* <BrowseFilesContainer
                                onDropFiles={(files) => this.processAmenityIconFiles(files, 'amenities', index)}
                                css={browseContainer}
                                dropContainerCss={styles.smallFileDrop} /> */}
                            <div className={styles.filesLength}>1 Icon Uploaded</div>
                        </div>
                        {/* <div className="col-sm-4">
                            <button className="btn btn-dark" type="button" >Remove</button>
                        </div> */}
                    </div>
        })

        const amenityNonUploadedList = Array.apply(null, Array(amenities.count)).map((amenity, index) => {
            return <div className="row">
                        <div className="col-sm-4">
                            <label htmlFor={"amenityTitle"+index} className="col-sm-auto col-form-label">Title</label>
                            <div className={`col-sm-12 ${styles.autoMargin}`}>
                                <FormControl
                                    name={`amenityTitle_iconFiles${index}`}
                                    type="text" 
                                    value={amenities.iconFiles[index] !== undefined ? amenities.iconFiles[index].title : ""}
                                    id={`amenityTitle_iconFiles${index}`}
                                    onChange={(e) => this.onChangeAmenityTitle(e, 'amenities', 'iconFiles')}
                                    className="form-control" 
                                    placeholder={"Amenity Title " + (index + 1)}
                                    required={true}
                                />
                            </div>
                        </div>
                        
                        <div className="col-sm-4">
                            <BrowseFilesContainer
                                onDropFiles={(files) => this.processAmenityIconFiles(files, 'amenities', index)}
                                css={browseContainer} 
                                dropContainerCss={styles.smallFileDrop} 
                            >Drop a icon here or click here to browse the icon!</BrowseFilesContainer>
                            <div className={styles.filesLength}>{amenities.iconFiles[index].iconFile.name !== undefined ? 1 : 0} Icon Selected</div>
                        </div>
                        <div className="col-sm-4">
                            <button className="btn btn-dark" type="button" onClick={() => this.onRemoveAmenityIcon('iconFiles', index)}>Remove</button>
                        </div>
                    </div>
        })
        return <>
            {amenityUploadedList}
            {amenityNonUploadedList}
        </>;
    }

    onChangeHandler = (e, section) => {
        const inputData = {}
        inputData[section] = this.state[section];
        inputData[section][e.target.name] = e.target.value;
        this.setState(inputData);
    }

    onChangeVirtualTour = (e, section , sectionKey) => {
        const inputData = {}
        inputData[section] = this.state[section];
        let index = e.target.name.replace('tourLink', '');
        inputData[section][sectionKey][index].tourLink = e.target.value;
        this.setState(inputData);
    }

    onAddAmenityHandler = () => {
        const inputData = {};
        inputData.amenities = this.state.amenities;
        inputData.amenities.iconFiles.push({ iconFile : {}, title : ""})
        inputData.amenities.count++;
        this.setState(inputData);
    }

    onRemoveAmenityIcon = (sectionKey, index) => {
        if (sectionKey == 'iconFiles'){
            const inputData = {};
            inputData.amenities = this.state.amenities;
            inputData.amenities[sectionKey].splice(index, 1);
            inputData.amenities.count--;
            this.setState(inputData);
        } else{

        }
    }

    onChangeAmenityTitle = (e, section, sectionKey) => {
        const inputData = {}
        inputData[section] = this.state[section];
        let index = e.target.name.replace(`amenityTitle_${sectionKey}`, '');
        if(inputData[section][sectionKey][index] !== undefined){
            inputData[section][sectionKey][index].title = e.target.value;
        } else {
            inputData[section][sectionKey][index] = {};
            inputData[section][sectionKey][index].title = e.target.value;
        }
        this.setState(inputData);
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

    processFile = (files, section) => {
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

    processAmenityIconFiles = (files, section, amenityFileIndex) => {
        if(files.length > 0){
            Array.from(files).forEach(file => {
                const isImage = isImageFile(file);
                if(isImage){
                    const newSectionObj = this.state[section];
                    const newFiles = newSectionObj.iconFiles;
                    newFiles[amenityFileIndex].iconFile = file;
                    newSectionObj.iconFiles = newFiles;

                    const inputData = {};
                    inputData[section] = newSectionObj;
                    this.setState(inputData);
                }
            });
        }
    }

    // upload files to s3
    uploadFiles = async (section) => {
        const directoryName = this.state.directoryName + section;
        const sectionObj = lodashClonedeep(this.state[section]);
        switch (section) {
            case 'banner':  
            case 'amenities':
            case 'gallery':
            case 'floorPlans':
                var fileLength = sectionObj.files.length;
                var noOfFilesUploaded = 0;
                if(fileLength > 0) {
                    sectionObj.files.forEach((file, index) => {
                        file.customFileName = this.getCustomeFileName(file.name, section, index);
                        uploadFileToS3(file, directoryName).then(data => {
                            sectionObj.files.forEach((singleFile, i) => {
                                if(singleFile.name == data.fileName) {
                                    sectionObj.images.push(data.location);
                                    sectionObj.files.splice(i, 1);
                                    return false;
                                }
                            })
                            const inputData = {};
                            inputData[section] = sectionObj;
                            noOfFilesUploaded++;
                            this.setState(inputData);
                            if(noOfFilesUploaded == fileLength){
                                this.updateProjectInfo(undefined, section);
                            }
                        }).catch(err => {
                            console.error("upload errr ",err)
                        });
                    });
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
                var fileLength = sectionObj.files.length;
                var noOfFilesUploaded = 0;
                if(fileLength > 0){

                    sectionObj.files.forEach((fileObj, index) => {
                        // fileObj.tourImageFile.name = (this.state.virtualTour.list.length + 1) + getFileExtension(fileObj.tourImageFile);
                        uploadFileToS3(fileObj.tourImageFile, directoryName).then(data => {
                            sectionObj.files.forEach((singleFile, i) => {
                                if(singleFile.tourImageFile.name == data.fileName) {
                                    sectionObj.list.push({tourImageLink : data.location, tourLink : singleFile.tourLink});
                                    sectionObj.files.splice(i, 1);
                                    return false;
                                }
                            })
                            const inputData = {};
                            inputData[section] = sectionObj;
                            noOfFilesUploaded++;
                            this.setState(inputData);
                            if(noOfFilesUploaded == fileLength){
                                this.updateProjectInfo(undefined, section);
                            }
                        }).catch(err => {
                            console.error("upload errr ",err);
                            this.updateProjectInfo(undefined, section);
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

    // upload amenity icons to s3
    uploadAmenityIcons = (sectionId) => {
        var amenitiesForm = document.getElementById('amenitySectionForm');
        if(!amenitiesForm.checkValidity()){ // validation not working here needs to check
            return false;
        }

        const directoryName = this.state.directoryName + sectionId + "/Icons";
        const sectionObj = lodashClonedeep(this.state[sectionId]);

        const fileLength = sectionObj.iconFiles.length;
        let noOfFilesUploaded = 0;

        if(fileLength > 0){
            const isAmenityListValid = this.getIsAmenityListvallid(sectionObj);
            if(isAmenityListValid){ // validated amenity list
                sectionObj.iconFiles.forEach((file, index) => {
                    uploadFileToS3(file.iconFile, directoryName).then(data => {
                        sectionObj.iconFiles.forEach((singleFile, i) => {
                            if(singleFile.iconFile.name == data.fileName) {
                                sectionObj.list.push({ icon: data.location, title: file.title});
                                sectionObj.iconFiles.splice(i, 1);
                                sectionObj.count--;
                                return false;
                            }
                        });

                        // set new updated section in state
                        const inputData = {};
                        inputData[sectionId] = sectionObj;
                        this.setState(inputData);

                        noOfFilesUploaded++;
                        // update data in db once all files are uploaded
                        if(noOfFilesUploaded == fileLength){
                            this.updateProjectInfo(undefined, sectionId);
                        }
                    }).catch(err => {
                        console.error("upload errr ",err)
                    });
                });
            }
        } else {
            // no new files added/updated hence update static data
            this.updateProjectInfo(undefined, sectionId); 
        }
    }

    // save data in db
    updateProjectInfo = (e, section) => {
        if(e !== undefined){
            e.preventDefault();
        }

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
                if(response.data){
                    this.saveDetailsInApplication(response.data.data[0]);
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

    // get projectObj to upload
    // (this fn will return a project object which will contain a updated intended section
    // & other sections will be old)
    getUpdatedProject = (sectionId, data) => {
        const project = lodashClonedeep(this.state.project);
        let updatedSection = lodashClonedeep(data);
        let oldSectionArr, newSectionArr;

        oldSectionArr = lodashClonedeep(project.websiteMenus.sections);
        newSectionArr = oldSectionArr.map((oldSection) => {
            if(oldSection.id == sectionId) {
                if(updatedSection.files) delete updatedSection.files;
                if(updatedSection.brochureFile) delete updatedSection.brochureFile;
                if(updatedSection.iconFiles) delete updatedSection.iconFiles;
                if(updatedSection.count !== undefined) delete updatedSection.count;
                return updatedSection;
            }
            else return oldSection;
        })
            
        project.websiteMenus.sections = newSectionArr;
        return project;
    }

    saveDetailsInApplication = (data) => {
        const user = this.state.user;
        // get list of updated projects
        const updatedProjects = user.projects.map(project => {
            if(project.id == data.id){ // project id matched then return updated project data
                return data;
            }
            return project; // else return old project
        });
        user.projects = updatedProjects;
        this.setState({ user : user, project : data});
        localStorage.setItem('loggedInUser', JSON.stringify(user));
    }

    getIsBrochureSelected = () => {
        if("name" in this.state.about.brochureFile) return true;
        else return false;
    }

    // validate amenity icon list
    getIsAmenityListvallid = (sectionObj) => {
        let isListValid = true;

        for (let index = 0; index < sectionObj.iconFiles.length; index++) {
            const file = sectionObj.iconFiles[index];
            if(file.title == ""){
                document.getElementById(`amenityTitle_iconFiles${index}`).focus();
                isListValid = false;
                break;
            } else if (file.iconFile.name == undefined){
                alert('Choose icon');
                isListValid = false;
                break;
            }
        }

        return isListValid;
    }

    getCustomeFileName = (fileName, sectionId, index) => {
        switch (sectionId) {
            case 'banner':  
            case 'amenities':
            case 'gallery':
            case 'floorPlans':
                const sectionObj = this.state[sectionId];
                const ext = getFileExtension(fileName);
                return `${sectionObj.images.length + index}.${ext}`; 
                break;
        
            default:
                break;
        }
    }

    // Reset a section
    resetSection = (sectionId, subSection) => {
        const inputData = {};
        const oldSectionArr = lodashClonedeep(this.state.project.websiteMenus.sections);

        let sectionToreset = oldSectionArr.filter((oldSection) => oldSection.id == sectionId);

        let temp = getStaticProcessingSections(); // get static section object
        temp = temp[sectionId];

        if(sectionToreset.length > 0){
                sectionToreset = sectionToreset[0];
                if(sectionId == 'amenities'){
                    this.getAmenitiesSectionToReset(sectionId, subSection, temp);
                } 

                // merge old section obj with the static obj(we need some empty members from static for processing files)
                inputData[sectionId] = Object.assign(temp, sectionToreset) ; 
        } else {
            if(sectionId == 'amenities'){
                this.getAmenitiesSectionToReset(sectionId, subSection, temp);
            } 
            inputData[sectionId] = temp;
        }
        this.setState(inputData);
    }

    getAmenitiesSectionToReset = (sectionId, subSection, temp) => {
        if(subSection == "iconFiles"){
            temp.iconFiles = [];
            temp.count = 0;
            temp.files = this.state[sectionId].files;
        } else {
            temp.files = [];
            temp.iconFiles = this.state[sectionId].iconFiles;
            temp.count = this.state[sectionId].count;
        }
        return temp;
    }
}

export default withRouter(ProjectItem);