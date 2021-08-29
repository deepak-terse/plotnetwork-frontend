import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/FormInput.module.scss'

export default function ColorInput(props) {
    console.log(styles.input);
    return <div className = {props.className}> 
        <input 
            type = {props.type}
            name = {props.name}
            placeholder = {props.placeholder}
            value = {props.value}
            onChange = {props.onChange}
        />
        <span>{props.value}</span>
    </div>
}

ColorInput.defaultProps = {
    type: "color",
    className: styles.colorInput
}

ColorInput.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['color']),
    placeholder: PropTypes.string.isRequired,
    className: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired
}