import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/FormInput.module.scss'

export default function Button(props) {
    console.log(styles.input);
    return <input 
        type = {props.type}
        value = {props.placeholder}
        className = {props.className}
        onClick = {props.onClick}
        />
}

Button.defaultProps = {
    type: "button",
    className: styles.button
}

Button.propTypes = {
    type: PropTypes.oneOf(['button', 'reset']),
    placeholder: PropTypes.string.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func
}