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
        console.log("inside remove");
        // const filteredImages = this.state.images.filter((image) => image.name !== data.name);
        this.props.onUpdate(data);
        // this.setState({ images : filteredImages});
    }

    render(){
        const { images } = this.state;
        const imageList = images.map((image) =>
            <ImagePreview key={image.name} data={image} onRemove={this.onRemoveImageHandler} />
        )
        return (
            <div >
                {/* {imageList} */}
            </div>
        )
    }
}

export default withRouter(ImagePreviewList);