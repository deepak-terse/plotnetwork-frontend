import React, { Component } from 'react';

import { FileDrop } from 'react-file-drop';
import styles from '../styles/FileUpload.module.scss';

class BrowseFilesContainer extends Component {
    constructor(props){
        super(props);
        this.fileInputRef = React.createRef();
    }

    render(){
        const fileDragContainer = { border: '1px solid #ff6e40', ...this.props.css, color: '#ff6e40', padding: 20, margin: 'auto' };
        const { onDropFiles, dropContainerCss } = this.props;
        return (
            <div>
                <div style={fileDragContainer}>
                    <FileDrop 
                        className={dropContainerCss}
                        targetClassName={styles.fileDropTarget}
                        draggingOverFrameClassName={styles.fileDropDraggingOverFrame}
                        draggingOverTargetClassName={styles.fileDropDraggingOverTarget}
    
                        onDrop={(files) => onDropFiles(files)}
                        onTargetClick={(e) => this.fileInputRef.current.click()}>
                        Drop some files here or click here to browse the files!
                    </FileDrop>
                </div>
                <input
                    onChange={(e) => onDropFiles(e.target.files)}
                    ref={this.fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg"
                />
            </div>
        )
    }
}

export default BrowseFilesContainer;
