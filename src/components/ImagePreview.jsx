import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class ImagePreview extends Component {
    constructor(props){
        super(props);

    }

    render(){
        const { data, onRemove } = this.props;
        const imageDiv = {
            height: '200px',
            width: '300px',
            margin: '5px',
            float: 'left'
        }
        const imgElement = {
            height: 'inherit',
            width: 'inherit'
        }
        const removeBtn = {
            fontSize: '14px',
            textAlign: 'right'
        }

        let imgSource = '';
        if(typeof data == "object"){
            imgSource = URL.createObjectURL(data);
        } else imgSource = data;
        
        return (
            <div style={imageDiv}>
                <span style={removeBtn} 
                    onClick={() => onRemove(data)} >X</span>
                <img 
                    style={imgElement} 
                    src={imgSource} 
                    alt={data.name}/> 
            </div>
        )
    }
}

export default withRouter(ImagePreview);