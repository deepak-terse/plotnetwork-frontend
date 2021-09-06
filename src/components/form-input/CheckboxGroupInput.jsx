import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/FormInput.module.scss';
import CheckboxInput from './CheckboxInput';

export default function CheckboxGroupInput(props) {
    console.log(styles.input);
    return (
        props.options.map((option) =>
            <CheckboxInput 
                    type = {props.type}
                    name = {option.id}
                    placeholder = {option.fullName}
                    value = {props.value}
                    className = {props.className}
                    onChange = {option.onChange}
                    disabled={props.disabled}
                />
        )
    )
}