import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import ImagePreview from './ImagePreview';

class ImagePreviewList extends Component {
    constructor(props){
        super(props);
    }

    render(){
        const { imageLinks, imageFiles } = this.props;
        let imageList = '';
        let imageFileList = '';

        if(imageLinks !== undefined){
            imageList = imageLinks.map((image, index) =>
                <ImagePreview 
                    key={index} 
                    data={image} 
                    onRemove={() => this.props.onRemoveImageLink(image)} />
            )
        }
        if(imageFiles !== undefined){
            imageFileList = imageFiles.map((imgFile, index) =>
                <ImagePreview 
                    key={index} 
                    data={imgFile} 
                    onRemove={() => this.props.onRemoveImageFile(imgFile)} />
            )
        }
        
        
        return (
            <div >
                {/* {imageList}
                {imageFileList} */}
            </div>
        )
    }
}

export default withRouter(ImagePreviewList);