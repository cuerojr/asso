import React,{useEffect} from 'react';
import AutocompletarGrid from './AutocompletarGrid';
import { connect } from 'react-redux';
import { fetchListarRecomendaciones } from '../../../../reducers/autocompletar-reducer';

const Recomendaciones = (props) => {
    const {recomendaciones, fetchListarRecomendaciones} = props;

    useEffect(()=>{
        if(!recomendaciones){
            fetchListarRecomendaciones();
        }

    },[recomendaciones, fetchListarRecomendaciones])

    return (
        <div>
            <AutocompletarGrid tipo="recomendacion" />
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        recomendaciones: state.autocompletarReducer.recomendaciones,
    }
}
export default connect(
    mapStateToProps,
    { fetchListarRecomendaciones, }
)(Recomendaciones);
