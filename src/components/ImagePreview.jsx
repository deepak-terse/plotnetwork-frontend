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
            width: 'inherit',
            maxHeight: '151px'
        }
        const removeBtn = {
            fontSize: '14px',
            textAlign: 'right'
        }

        let imgSource = '';
        console.log(data)
        console.log(typeof data)
        if(typeof data == "object"){
            console.log(Object.keys(data).length)
        }
        if(typeof data == "object" && data.name !== undefined){
            imgSource = URL.createObjectURL(data);
        } else if(typeof data == "string"){
            imgSource = data;
        }

        return (
            
            <div style={imageDiv}>
                {/* <i class="mdi mdi-close-circle-outline"
                    style={{color:'red'}}
                    onClick={() => onRemove(data)} >
                </i> */}
                
                {/* <span style={removeBtn} 
                    onClick={() => onRemove(data)} >X</span> */}
                {
                    imgSource !== '' ?
                        <img style={imgElement} src={imgSource + "#" + new Date().getTime()} /> 
                    : ''
                }  
            </div>
        )
    }
}

export default withRouter(ImagePreview);