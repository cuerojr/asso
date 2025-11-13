import React from 'react';
import { MiniTarjeta } from './miniTarjeta';
import { Pie } from 'react-chartjs-2';
import './estilos.scss';

const GraficoTortaAdministracion = (props) => {
    const { info, options } = props;
    if(!info.datasets.length){
        info.datasets = [info.datasets];
    }

    return (
        <MiniTarjeta classes='mr-2 mt-3 text-center'>
            <div className='d-flex flex-column'>
                <h4 className='color-azul font-weight-bold mt-4 mb-4'>{info.titulo}</h4>
                <div className="d-flex justify-content-center mb-4">
                    <Pie data={info} options={options} height={200} width={220} />
                </div>
                <div className=''>
                        {info.labels.map((valor, ind) => (
                            <div 
                                className='mb-0 pl-1 d-flex justify-content-start align-items-center gap-2'
                                key={ind}>
                                <div 
                                    style={{ 
                                        backgroundColor: info.datasets[0].backgroundColor[ind], 
                                        width: "10px", 
                                        height: "10px",
                                        marginRight: ".2rem",
                                    }}></div>
                                <p className="color-azul mb-0"
                                    style={{
                                        fontSize: ".75rem",
                                    }}>{`${ind === 0? "CONTROLADOS":"NO CONTROLADOS"}: ${info.datasets[0].data[ind]}`}</p>
                            </div>
                        ))}
                    
                </div>
            </div>
        </MiniTarjeta>
    );
};

export default GraficoTortaAdministracion;