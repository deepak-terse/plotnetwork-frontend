import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import ImagePreview from './ImagePreview';

class ImagePreviewList extends Component {
    constructor(props){
        super(props);

        this.state = {
            images : this.props.imageLinks,
            files : this.props.imageFiles,
        };
    }

    componentWillReceiveProps(newProps){
        this.setState({ 
            images : newProps.imageLinks,
            files : newProps.imageFiles 
        })
    }

    render(){
        const { images, files } = this.state;
        let imageList = '';
        let imageFileList = '';

        if(images !== undefined){
            imageList = images.map((image, index) =>
                <ImagePreview 
                    key={index} 
                    data={image} 
                    onRemove={() => this.props.onRemoveImageLink(image)} />
            )
        }
        if(files !== undefined){
            imageFileList = files.map((imgFile, index) =>
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