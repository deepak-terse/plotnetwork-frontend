import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/FormInput.module.scss'

export default function NumberInput(props) {
    console.log(styles.input);
    return <input 
        type = "number"
        name = {props.name}
        placeholder = {props.placeholder}
        value = {props.value}
        className = {props.className}
        onChange = {props.onChange}
        />
}

NumberInput.defaultProps = {
    type: "number",
    className: styles.input
}

NumberInput.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['number']),
    placeholder: PropTypes.string.isRequired,
    className: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired
}