import React,{useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentDots} from '@fortawesome/free-solid-svg-icons';
import './comentario.scss'

const ComentarioCliente = ({comentario}) => {
    const [visibleBuble, setVisibleBuble] = useState(false);

    const visibleHandle = () => {
        setVisibleBuble(!visibleBuble)
    }

    return (
        <>
            {visibleBuble && <div className='comentario-wrapper'>
               <p><strong>Nota del cliente:</strong></p>
               <p>{comentario}</p>
            </div>}
            <div style={{'fontSize':'14px'}}>Nota del cliente</div> <FontAwesomeIcon icon={faCommentDots} style={{'color':'#ffda6f'}} className='ml-3' onClick={visibleHandle} />
        </>
    );
};

export default ComentarioCliente;