import React from 'react';
import { InputGroup, InputGroupAddon } from "reactstrap";
import Select from "react-select";
import CustomSelectInput from "../../../../../components/common/CustomSelectInput";

const CustomSelect = ({ label, options, value, onChange, isDisabled, placeholder }) => (
    <InputGroup>
        <InputGroupAddon className="col-12 col-md-5 p-0" addonType="prepend">
            {label}
        </InputGroupAddon>
        <Select
            components={{ Input: CustomSelectInput }}
            className="react-select-fallas borde-gris col-12 col-md-7 p-0"
            classNamePrefix="react-select"
            styles={{
                option: (provided) => ({
                    ...provided,
                    padding: '10px',
                }),
                multiValueLabel: (provided) => ({
                    ...provided,
                })
            }}
            isMulti
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            options={options}
            isDisabled={isDisabled}
        />
    </InputGroup>
);

export default CustomSelect;