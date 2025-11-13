import React, {useEffect} from 'react';
import AutocompletarGrid from './AutocompletarGrid';
import { connect } from 'react-redux';
import { fetchListarObservaciones } from '../../../../reducers/autocompletar-reducer';

const Observaciones = (props) => {
    const {observaciones, fetchListarObservaciones} = props;

    useEffect(()=>{
        if(!observaciones){
            fetchListarObservaciones();
        }

    },[observaciones, fetchListarObservaciones])

    return (
        <div>
            <AutocompletarGrid tipo="observacion" />
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        observaciones: state.autocompletarReducer.observaciones,
    }
}
export default connect(
    mapStateToProps,
    { fetchListarObservaciones, }
)(Observaciones);
