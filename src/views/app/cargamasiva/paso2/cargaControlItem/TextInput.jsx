import React from 'react';
import { InputGroup,Input } from "reactstrap";

const TextInput = ({ label, value, onChange, type = "textarea", options, disabled }) => (
    <InputGroup className="mt-4 borde-gris mb-4">
        <div className='legend'>{label}</div>
        {type === "select" ? (
            <Input value={value} type="select" onChange={onChange} disabled={disabled}>
                <option>-- {label} Guardadas: -- </option>
                {options && options.map((option) => (
                    <option key={option.id} value={option.texto}>{option.nombre_corto}</option>
                ))}
            </Input>
        ) : (
            <Input className='no-border mt-2' type={type} value={value} onChange={onChange} disabled={disabled}/>
        )}
    </InputGroup>
);

export default TextInput;