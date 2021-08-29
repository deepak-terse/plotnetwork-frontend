import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/FormInput.module.scss'

export default function SelectInput(props) {
    console.log(styles.input);
    return <select 
        name = {props.name}
        value = {props.value}
        className = {props.className}
        value = {props.value}
        onChange = {props.onChange}
        disabled={props.disabled}
        required={props.required}
        >
            <option value="">{props.placeholder}</option>
            {props.options.map((option) =>
                <option key={option.id} value={option.id}>{option.fullName}</option>
            )}
    </select>
}

SelectInput.defaultProps = {
    type: "select",
    className: styles.input,
    options : []
}

SelectInput.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['select']),
    placeholder: PropTypes.string.isRequired,
    className: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.object).isRequired
}