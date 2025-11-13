import React, {  useState, useEffect } from 'react';
import Select from "react-select";
import CustomSelectInput from "../components/common/CustomSelectInput";

const SelectMultiple = (props) => {

    const [seccionesOpciones, setSeccionesOpciones] = useState([])

    useEffect(() => {
        const fallasSelecionadasAmostrar = []
        fallasSelecionadasAmostrar.push({ value: 999999999999, label: <span dangerouslySetInnerHTML={{ __html: `<div class="falla-color-wrapper">Todas las ${props.placeholderPlural}</div>` }} /> })
        props.items && props.items.forEach((item) => {
            let fallita = { value: item.id, label: <span dangerouslySetInnerHTML={{ __html: '<div class="falla-color-wrapper">' + item.nombre + '</div>' }} /> }
            fallasSelecionadasAmostrar.push(fallita)
        })
        setSeccionesOpciones(fallasSelecionadasAmostrar);
    }, [props.items])

    return (
        <>{props.items &&
            <Select
                components={{ Input: CustomSelectInput }}
                className="react-select-secciones"
                classNamePrefix="react-select"
                isMulti
                placeholder={`Seleccione una ${props.placeholderSingular}`}
                name="form-field-name"
                value={props.itemsSeleccionados}
                onChange={props.handleChangeMulti}
                options={seccionesOpciones}
                isDisabled={props.isDisabled}
            />}
        </>
    )

}

export default SelectMultiple;