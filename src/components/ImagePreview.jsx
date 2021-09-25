import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class ImagePreview extends Component {
    constructor(props){
        super(props);

    }

    render(){
        const { data, onRemove } = this.props;
        const imageDiv = {
            height: 'inherit',
            width: 'inherit',
            margin: '5px'
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
                {/* <i class="mdi mdi-close-circle-outline"
                    style={{color:'red'}}
                    onClick={() => onRemove(data)} >
                </i> */}
                
                {/* <span style={removeBtn} 
                    onClick={() => onRemove(data)} >X</span> */}
                <img 
                    style={imgElement} 
                    src={imgSource} /> 
            </div>
        )
    }
}

export default withRouter(ImagePreview);