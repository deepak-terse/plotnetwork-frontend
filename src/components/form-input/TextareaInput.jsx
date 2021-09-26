import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/FormInput.module.scss'

export default function TextareaInput(props) {
    return <textarea 
        name = {props.name}
        value = {props.value}
        id = {props.id}
        rows = {props.rows}
        onChange = {props.onChange}
        className = {props.className}
        placeholder = {props.placeholder}
        required={props.required}
        disabled={props.disabled} />
}

TextareaInput.defaultProps = {
    className: styles.input,
    rows: "4"
}

TextareaInput.propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    className: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired
}