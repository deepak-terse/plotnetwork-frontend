
export function SectionContainer(props) {
    return (
        <div className={props.class}>
            <div className="sectionTitle">{props.displayTitle}</div>
            <div className="sectionContent" style={{textAlign: 'center'}}>
                {props.children}
            </div>   
        </div>
    )
}

export default SectionContainer;
