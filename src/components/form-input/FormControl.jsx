import TextInput from './TextInput';
import NumberInput from './NumberInput';
import DateInput from './DateInput';
import FileInput from './FileInput';
import ColorInput from './ColorInput';
import SelectInput from './SelectInput';
import RadioInput from './RadioInput';
import CheckboxInput from './CheckboxInput';
import Button from './Button';

export default function FormControl(props) {
    switch(props.type) {
        case 'text':
        case 'email':
        case 'password':
            return <TextInput 
                type = {props.type}
                name = {props.name}
                placeholder = {props.placeholder}
                value = {props.value}
                className = {props.className}
                onChange = {props.onChange}
                disabled={props.disabled}
            />
            break;
        case 'number':
            return <NumberInput 
                type = "number"
                name = {props.name}
                placeholder = {props.placeholder}
                value = {props.value}
                className = {props.className}
                onChange = {props.onChange}
                disabled={props.disabled}
            />
            break;
        case 'date':
        case 'datetime-local':
            return <DateInput 
                type = {props.type}
                name = {props.name}
                placeholder = {props.placeholder}
                value = {props.value}
                className = {props.className}
                onChange = {props.onChange}
                disabled={props.disabled}
            />
            break;
        case 'select':
            return <SelectInput
                name = {props.name}
                placeholder = {props.placeholder}
                options = {props.options}
                value = {props.value}
                className = {props.className}
                onChange = {props.onChange}
                disabled={props.disabled}
                required={props.required}
            />
            break;
        case 'radio':
        case 'checkbox':
        case 'color':
        case 'file':
    }
}