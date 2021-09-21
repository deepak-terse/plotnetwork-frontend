import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import ImagePreview from './ImagePreview';

class ImagePreviewList extends Component {
    constructor(props){
        super(props);

        this.state = {
            images : this.props.images
        };
    }

    componentWillReceiveProps(newProps){
        this.setState({ images : newProps.images })
    }

    onRemoveImageHandler = (data) => {
        this.props.onUpdate(data);
    }

    render(){
        const { images } = this.state;
        const imageList = images.map((image, index) =>
            <ImagePreview key={index} data={image} onRemove={this.onRemoveImageHandler} />
        )
        return (
            <div >
                {imageList}
            </div>
        )
    }
}

export default withRouter(ImagePreviewList);