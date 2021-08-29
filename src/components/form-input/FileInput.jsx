import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/FormInput.module.scss'

export default function FileInput(props) {
    console.log(styles.input);
    return <input 
        type = {props.type}
        name = {props.name}
        placeholder = {props.placeholder}
        value = {props.value}
        className = {props.className}
        onChange = {props.onChange}
        />
}

FileInput.defaultProps = {
    type: "file",
    className: styles.input
}

FileInput.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['file']),
    placeholder: PropTypes.string.isRequired,
    className: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired
}