import FormControl from './form-input/FormControl';
import ImagePreview from './ImagePreview';
import BrowseFilesContainer from './BrowseFilesContainer';

import styles from '../styles/FileUpload.module.scss';

export default function TextFieldBrowseFileRowContainer(props) {

    console.log(props)
    return (
        <div className="row">
            <div className={`col-sm-4 ${styles.verticllyMiddle}`}>
                <label htmlFor={props.id} className="col-sm-auto col-form-label">Title</label>
                <div className={`col-sm-12 ${styles.autoMargin}`}>
                    <FormControl
                        name={props.name}
                        type="text" 
                        value={props.value}
                        id={props.id}
                        onChange={props.onChange}
                        className="form-control"
                        placeholder={props.placeholder}
                        required={true}
                    />
                </div>
            </div>
            <div className="col-sm-4" style={{verticalAlign: 'middle', margin: 'auto 0'}}>
                {
                    props.image !== undefined? 
                        <ImagePreview 
                            data={props.image} 
                            onRemoveImageFile={props.onRemoveImageFile}
                            onRemoveImageLink={props.onRemoveImageLink} 
                        />
                     : <>
                        <div style={{margin:'5px'}}>
                            <BrowseFilesContainer
                                onDropFiles={props.onDropFiles}
                                css={props.css} 
                                dropContainerCss={props.dropContainerCss} >
                                    {props.browseText}
                            </BrowseFilesContainer>
                        </div>
                        <div className={styles.filesLength}>{props.file.name !== undefined ? 1 : 0} Icon Selected</div>
                     </>
                }
            </div>

            <div className={`col-sm-4 ${styles.verticllyMiddle}`}>
                {
                    props.image ? 
                      <div className={styles.filesLength}>1 Icon Uploaded</div>
                    : <button className="btn btn-dark" type="button" onClick={props.onRemoveRow}>Remove</button>
                }
            </div>
        </div>
    )
}