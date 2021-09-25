
export function SectionContainer(props) {
    const titleCSS = {margin : '15px'};
    return (
        <div className={props.class}>
            <div className="sectionTitle" style={titleCSS}>{props.displayTitle}</div>
            <div className="sectionContent" style={{textAlign: 'center'}}>
                {props.children}
            </div>   
        </div>
    )
}

export default SectionContainer;
