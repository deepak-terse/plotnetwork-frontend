import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import ImagePreview from './ImagePreview';

class ImagePreviewList extends Component {
    constructor(props){
        super(props);
    }

    render(){
        const { imageLinks, imageFiles} = this.props;
        const imageDivCss = { margin: 'auto', justifyContent: 'center'};

        let imageList = '';
        let imageFileList = '';

        if(imageLinks !== undefined){
            imageList = imageLinks.map((image, index) =>
                <div className="col-sm-3">
                    <ImagePreview 
                        key={`images${index}`} 
                        data={image} 
                        onRemove={() => this.props.onRemoveImageLink(image)} />
                </div>
            )
        }
        if(imageFiles !== undefined){
            imageFileList = imageFiles.map((imgFile, index) =>
                <div className="col-sm-3">
                    <ImagePreview 
                        key={`files${index}`} 
                        data={imgFile} 
                        onRemove={() => this.props.onRemoveImageFile(imgFile)} />
                </div>
            )
        }
        
        
        return (
            <div className="row" style={imageDivCss}>
                {imageList}
                {imageFileList}
            </div>
        )
    }
}

export default withRouter(ImagePreviewList);