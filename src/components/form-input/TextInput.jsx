import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/FormInput.module.scss'

export default function TextInput(props) {
    console.log("###################### props ", props);
    return <input 
        type = {props.type}
        name = {props.name}
        placeholder = {props.placeholder}
        value = {props.value}
        className = {props.className}
        onChange = {props.onChange}
        disabled = {props.disabled}
        />
}

TextInput.defaultProps = {
    type: "text",
    className: styles.input
}

TextInput.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['text', 'email', 'password']),
    placeholder: PropTypes.string.isRequired,
    className: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired
}