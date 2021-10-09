import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import ImagePreviewList from './ImagePreviewList';
import ImagePreview from './ImagePreview';
import TextFieldBrowseFileRowContainer from './TextFieldBrowseFileRowContainer';
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
        console.log(this.state)
        const { project, presetAmenities, banner, about, amenities, virtualTour, gallery, floorPlans, contactUs, footer} =  this.state;
        const browseContainer = {width: 'inherit'};
        // const fitContentWidth = {width : 'fit-content', float : 'left', margin: '5px' , height: 'auto'};

        const amenityList = this.getAmenityList();        
        const virtualTourList = this.getVirtualTourList();

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
                                                                <label htmlFor="displayTitle" className="col-sm-auto col-form-label">Title</label>
                                                                <FormControl
                                                                    name="displayTitle"
                                                                    type="text" 
                                                                    value={about.displayTitle}
                                                                    id="displayTitle"
                                                                    onChange={(e) => this.onChangeHandler(e, 'about')} 
                                                                    className="form-control" 
                                                                    placeholder=""
                                                                    required={true}
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
                                                                    required={true}
                                                                />
                                                            </div>

                                                            <div className={`col-sm-7 ${styles.autoMargin}`}>
                                                                <BrowseFilesContainer 
                                                                    onDropFiles={(files) => this.processFile(files, 'about')}
                                                                    css={browseContainer} 
                                                                    dropContainerCss={styles.fileDrop}
                                                                >Drop one photo here or click here to browse the photo!</BrowseFilesContainer>
                                                            </div>
                                                            
                                                            <div className={styles.filesLength}>{about.image !== "" ? 1 : 0} photo Uploaded, {this.isAboutUsPhotoSelected() ? 1 : 0} Photo Selected</div>
                                                            
                                                            {/* <ImagePreview 
                                                                data={about.image} 
                                                                onRemoveImageFile={(data) => this.removeNonUploadedImage(data, 'about')}
                                                                onRemoveImageLink={(data) => this.removeUploadedImage(data, 'about')} 
                                                            /> */}
                                                            <ImagePreviewList 
                                                                imageLinks={about.image !== "" ? [about.image] : []} 
                                                                imageFiles={this.isAboutUsPhotoSelected() ? [about.imageFile] : []} 
                                                                onRemoveImageFile={(data) => this.removeNonUploadedImage(data, 'about')}
                                                                onRemoveImageLink={(data) => this.removeUploadedImage(data, 'about')} 
                                                            />

                                                            <div className={`col-sm-7 ${styles.autoMargin}`}>
                                                                <label className="col-sm-auto col-form-label">Project Brochure</label>
                                                                <BrowseFilesContainer 
                                                                    onDropFiles={(files) => this.processAboutUsBrochure(files, 'about')} 
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
                                                
                                                <form className="forms-sample" name="amenitySectionForm" id="amenitySectionForm">
                                                    <div className={`col-sm-7 ${styles.autoMargin}`}>
                                                        {amenityList}
                                                        <div style={{margin : '15px auto', justifyContent: 'center'}}>
                                                            <button className="btn btn-primary mr-2" onClick={(e) =>  {e.preventDefault(); this.onAddAmenityHandler()}}>
                                                                        ADD AMENITY
                                                            </button>
                                                                <button className="btn btn-primary mr-2" onClick={(e) =>  {e.preventDefault(); this.uploadAmenityIcons('amenities')}}>SAVE</button>
                                                                <button className="btn btn-dark" type="button" onClick={(e) =>  {e.preventDefault(); this.resetSection('amenities', 'iconFiles')}} >RESET</button>
                                                        </div>
                                                        <BrowseFilesContainer 
                                                            onDropFiles={(files) => this.processFile(files, 'amenities')} 
                                                            css={browseContainer} 
                                                            dropContainerCss={styles.fileDrop}>
                                                                Drop some photos here or click here to browse the photo!
                                                        </BrowseFilesContainer>
                                                        
                                                    </div>
                                                        <br/>
                                                        
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
                                                
                                                
                                            </SectionContainer>

                                            <SectionContainer class={styles.sectionContainer} displayTitle="Virtual Tour"> 
                                                <div className={`col-sm-7 ${styles.autoMargin}`}>
                                                    <form className="forms-sample" name="virtualTourSectionForm" id="virtualTourSectionForm">
                                                        {virtualTourList}
                                                        <div style={{margin : '15px auto', justifyContent: 'center'}}>
                                                            <button className="btn btn-primary mr-2" onClick={(e) =>  {e.preventDefault(); this.onAddVirtualTour()}}>
                                                                        ADD VIRTUAL TOUR
                                                            </button>
                                                                <button className="btn btn-primary mr-2" onClick={(e) =>  {e.preventDefault(); this.uploadVirtualTours('virtualTour')}}>SAVE</button>
                                                                <button className="btn btn-dark" type="button" onClick={(e) =>  {e.preventDefault(); this.resetSection('virtualTour')}} >RESET</button>
                                                        </div>
                                                    </form>
                                                </div>
                                                

                                                <div>
                                                    {/* <div className={`col-sm-7 ${styles.autoMargin}`}>
                                                        <label className="col-sm-auto col-form-label">Virtual Tour Photo</label>
                                                        <BrowseFilesContainer 
                                                            onDropFiles={(files) => this.processFile(files, 'virtualTour')} 
                                                            css={browseContainer} 
                                                            dropContainerCss={styles.fileDrop}
                                                        >Drop some photos here or click here to browse the photo!</BrowseFilesContainer>
                                                    </div> */}
                                                    
                                                    {/* <div className={styles.filesLength}>{virtualTour.list.length} Photos Uploaded, {virtualTour.files.length} Photos Selected</div> */}
                                                    {/* <ImagePreviewList 
                                                        images={[virtualTour.imageLink]} 
                                                        imageFiles={virtualTour.files}
                                                        onUpdate={(data) => this.removeNonUploadedImage(data, 'virtualTour')}/> */}
                                                </div>
                                                <div>
                                                    {/* <label className="col-sm-auto col-form-label">Add links of Virtual Tour here</label>
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
                                                    )} */}
                                                </div>

                                                {/* <div style={{margin : '15px'}}>
                                                    <button className="btn btn-primary mr-2" onClick={(e) =>  {e.preventDefault(); this.uploadFiles('virtualTour')}}>SAVE</button>
                                                    <button className="btn btn-dark" type="button" onClick={(e) =>  {e.preventDefault(); this.resetSection('virtualTour')}} >RESET</button>
                                                </div> */}
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
                                                                    required={true}
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
                                                                    required={true}
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
                                                                    required={true}
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
            return <TextFieldBrowseFileRowContainer key={index}
                        // Props for text field
                        title="Title"
                        name={"amenityTitle_list"+index}
                        id={"amenityTitle_list"+index}
                        value={amenity.title}
                        onChange={(e) => this.onChangeAmenityTitle(e, 'amenities', 'list')}
                        className="form-control"
                        placeholder={"Amenity Title " + (index + 1)}
                        required={true}
                        // Props for image field
                        image={amenity.icon}
                        onRemoveImageFile={(data) => this.removeNonUploadedImage(data, 'amenities')}
                        onRemoveImageLink={(data) => this.removeUploadedImage(data, 'amenities')}
                    />
    })

        const amenityNonUploadedList = Array.apply(null, Array(amenities.count)).map((amenity, index) => {
            return <TextFieldBrowseFileRowContainer key={index}
                        // Props for text field
                        title="Title"
                        name={`amenityTitle_iconFiles${index}`}
                        id={`amenityTitle_iconFiles${index}`}
                        value={amenities.iconFiles[index] !== undefined ? amenities.iconFiles[index].title : ""}
                        onChange={(e) => this.onChangeAmenityTitle(e, 'amenities', 'iconFiles')}
                        className="form-control"
                        placeholder={"Amenity Title " + (index + 1)}
                        required={true}
                        // Props for image field
                        onRemoveImageFile={(data) => this.removeNonUploadedImage(data, 'amenities')}
                        onRemoveImageLink={(data) => this.removeUploadedImage(data, 'amenities')}
                        // Props for Browse container
                        onDropFiles={(files) => this.processAmenityIconFiles(files, 'amenities', index)}
                        css={browseContainer} 
                        dropContainerCss={styles.smallFileDrop} 
                        file={amenities.iconFiles[index] !== undefined ? amenities.iconFiles[index].iconFile : {}}
                        browseText="Drop a icon here or click here to browse the icon!"
                        //props for remove button
                        onRemoveRow={() => this.onRemoveAmenityIcon('iconFiles', index)}
                    />
        })
        return <>
            {amenityUploadedList}
            {amenityNonUploadedList}
        </>;
    }

    getVirtualTourList = () => {
        const browseContainer = {width: 'inherit'}
        const {virtualTour} = this.state;

        const tourUploadedList = virtualTour.list.map((tourObj, index) => {
        return <TextFieldBrowseFileRowContainer key={index}
                    // Props for text field
                    title="Virtual Tour Link"
                    name={"tourTitle_list"+index}
                    id={"tourTitle_list"+index}
                    value={tourObj.tourLink}
                    onChange={(e) => this.onChangeTourLink(e, 'virtualTour', 'list')}
                    className="form-control"
                    placeholder={"Tour Link " + (index + 1)}
                    required={true}
                    // Props for image field
                    image={tourObj.tourImageLink}
                    onRemoveImageFile={(data) => this.removeNonUploadedImage(data, 'virtualTour')}
                    onRemoveImageLink={(data) => this.removeUploadedImage(data, 'virtualTour')}
                />
    })

        const tourNonUploadedList = Array.apply(null, Array(virtualTour.count)).map((tourObj, index) => {
        return <TextFieldBrowseFileRowContainer key={index}
                    // Props for text field
                    title="Virtual Tour Link"
                    name={`tourTitle_files${index}`}
                    id={`tourTitle_files${index}`}
                    value={virtualTour.files[index] !== undefined ? virtualTour.files[index].tourLink : ""}
                    onChange={(e) => this.onChangeTourLink(e, 'virtualTour', 'files')}
                    className="form-control"
                    placeholder={"Tour Link " + (index + 1)}
                    required={true}
                    // Props for image field
                    onRemoveImageFile={(data) => this.removeNonUploadedImage(data, 'virtualTour')}
                    onRemoveImageLink={(data) => this.removeUploadedImage(data, 'virtualTour')}
                    // Props for Browse container
                    onDropFiles={(files) => this.processVirtualTourFiles(files, 'virtualTour', index)}
                    css={browseContainer} 
                    dropContainerCss={styles.smallFileDrop} 
                    file={virtualTour.files[index] !== undefined ? virtualTour.files[index].tourImageFile : {}}
                    browseText="Drop a photo here or click here to browse the photo!"
                    //props for remove button
                    onRemoveRow={() => this.onRemoveVirtualTour('files', index)}
                />
        })
        return <>
            {tourUploadedList}
            {tourNonUploadedList}
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

    onRemoveVirtualTour = (sectionKey, index) => {
        if (sectionKey == 'files'){
            const inputData = {};
            inputData.virtualTour = this.state.virtualTour;
            inputData.virtualTour[sectionKey].splice(index, 1);
            inputData.virtualTour.count--;
            this.setState(inputData);
        } else{

        }
    }

    onAddVirtualTour = () => {
        const inputData = {};
        inputData.virtualTour = this.state.virtualTour;
        inputData.virtualTour.files.push({tourImageFile : {}, tourLink : "" })
        inputData.virtualTour.count++;
        this.setState(inputData);
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

    onChangeTourLink = (e, section, sectionKey) => {
        const inputData = {}
        inputData[section] = this.state[section];
        let index = e.target.name.replace(`tourTitle_${sectionKey}`, '');
        if(inputData[section][sectionKey][index] !== undefined){
            inputData[section][sectionKey][index].tourLink = e.target.value;
        } else {
            inputData[section][sectionKey][index] = {};
            inputData[section][sectionKey][index].tourLink = e.target.value;
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
                    const isImage = isImageFile(file);
                    if(isImage){
                        const newSectionObj = this.state[section];
                        newSectionObj.imageFile = file;
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

    processAboutUsBrochure = (files, section) => {
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

    processVirtualTourFiles = (files, section, tourFileIndex) => {
        if(files.length > 0){
            Array.from(files).forEach(file => {
                const isImage = isImageFile(file);
                if(isImage){
                    const newSectionObj = this.state[section];
                    const newFiles = newSectionObj.files;
                    newFiles[tourFileIndex].tourImageFile = file;
                    newSectionObj.files = newFiles;

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
                const FilesToUpload = new Array();
                if(this.getIsBrochureSelected()){
                    sectionObj.brochureFile.customFileName = sectionObj.brochureFile.name;
                    sectionObj.brochureFile.subSection = "brochure";
                    FilesToUpload.push(sectionObj.brochureFile);
                }
                if(this.isAboutUsPhotoSelected()){
                    sectionObj.imageFile.customFileName = "about-us." + getFileExtension(sectionObj.imageFile.name);
                    sectionObj.imageFile.subSection = "image";
                    FilesToUpload.push(sectionObj.imageFile);
                }
                if(FilesToUpload.length > 0){
                    FilesToUpload.forEach((file) => {
                        uploadFileToS3(file, directoryName).then(data => {
                            if(file.subSection == "brochure"){
                                sectionObj.brochureLink = data.location;
                                sectionObj.brochureFile = {};
                            } else if(file.subSection == "image"){
                                sectionObj.image = data.location;
                                sectionObj.imageFile = {};
                            }
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
                    file.iconFile.customFileName = this.getCustomeFileName(file.iconFile.name, `${sectionId}_IconFiles`, index);
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

    uploadVirtualTours = (sectionId) => {
        var tourFormForm = document.getElementById('virtualTourSectionForm');
        if(!tourFormForm.checkValidity()){ // validation not working here needs to check
            return false;
        }

        const directoryName = this.state.directoryName + sectionId;
        const sectionObj = lodashClonedeep(this.state[sectionId]);
        var fileLength = sectionObj.files.length;
        var noOfFilesUploaded = 0;

        if(fileLength > 0){
            const isTourListListValid = this.getIsTourListvallid(sectionObj);
            if(isTourListListValid){
                sectionObj.files.forEach((fileObj, index) => {
                    fileObj.tourImageFile.customFileName = this.getCustomeFileName(fileObj.tourImageFile.name, sectionId, index);
                    uploadFileToS3(fileObj.tourImageFile, directoryName).then(data => {
                        sectionObj.files.forEach((singleFile, i) => {
                            if(singleFile.tourImageFile.name == data.fileName) {
                                sectionObj.list.push({tourImageLink : data.location, tourLink : singleFile.tourLink});
                                sectionObj.files.splice(i, 1);
                                sectionObj.count--;
                                return false;
                            }
                        })
    
                        // Set State
                        const inputData = {};
                        inputData[sectionId] = sectionObj;
                        noOfFilesUploaded++;
                        this.setState(inputData);
    
                        // Save data in db once all files uploaded
                        if(noOfFilesUploaded == fileLength){
                            this.updateProjectInfo(undefined, sectionId);
                        }
                    }).catch(err => {
                        console.error("upload errr ",err);
                        this.updateProjectInfo(undefined, sectionId);
                    });
                });
            }
            
        } else {
            // No files changed then save static data
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
        console.log(updatedProject)
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
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        const project = user.projects.filter(project => project.id == this.state.project.id)[0]; 
        let websiteMenus = project.websiteMenus;
        if(typeof websiteMenus !== 'object') project.websiteMenus = {};
        let sectionArray = project.websiteMenus.sections;
        if(!Array.isArray(sectionArray)) project.websiteMenus.sections = new Array();
        
        let updatedSection = lodashClonedeep(data);
        if(updatedSection.files) delete updatedSection.files;
        if(updatedSection.imageFile) delete updatedSection.imageFile;
        if(updatedSection.brochureFile) delete updatedSection.brochureFile;
        if(updatedSection.iconFiles) delete updatedSection.iconFiles;
        if(updatedSection.count !== undefined) delete updatedSection.count;

        const order = ['banner', 'about', 'amenities', 'virtualTour', 'gallery', 'floorPlans', 'contactUs', 'footer']
        const newSections = [];

        order.forEach((key) => {
            if(updatedSection.id == key){
                newSections.push(updatedSection);
            } else {
                const oldSection = project.websiteMenus.sections.filter((section) => section.id == key)
                if(oldSection.length > 0){
                    newSections.push(oldSection[0]);
                }
            }
        })
                    
        project.websiteMenus.sections = newSections;
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

    isAboutUsPhotoSelected = () => {
        if("name" in this.state.about.imageFile) return true;
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

    getIsTourListvallid = (sectionObj) => {
        let isListValid = true;

        for (let index = 0; index < sectionObj.files.length; index++) {
            const file = sectionObj.files[index];
            if(file.tourLink == ""){
                document.getElementById(`tourTitle_files${index}`).focus();
                isListValid = false;
                break;
            } else if (file.tourImageFile.name == undefined){
                alert('Choose photo');
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
                var sectionObj = this.state[sectionId];
                var ext = getFileExtension(fileName);
                return `${sectionObj.images.length + (index + 1)}.${ext}`; 
                break;

            case 'amenities_IconFiles':
                var sectionObj = this.state.amenities;
                var ext = getFileExtension(fileName);
                return `${sectionObj.list.length + (index + 1)}.${ext}`; 
                break;

            case 'virtualTour':
                var sectionObj = this.state.virtualTour;
                var ext = getFileExtension(fileName);
                return `${sectionObj.list.length + (index + 1)}.${ext}`; 
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