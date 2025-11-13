import React from 'react';
import { MiniTarjeta } from './miniTarjeta';
import { Pie } from 'react-chartjs-2';
import './estilos.scss';

const GraficoTorta = (props) => {
    const { info, options } = props;
    if(!info.datasets.length){
        info.datasets = [info.datasets];
    }

    return (
        <MiniTarjeta classes='mr-2 mt-3 text-center'>
            <div className='d-flex flex-column'>
                <h4 className='color-azul font-weight-bold mt-4 mb-4'>{info.titulo}</h4>
                <div className="d-flex justify-content-center mb-4"><Pie data={info} options={options} height={200} width={220} /></div>
                <div className='d-flex justify-content-center'>
                    <div className='text-left parawrapper'>
                        {info.labels.map((valor, ind) => {
                            return <div className='mb-0' key={ind}> <div className='rounded punto-grafico-resumen' style={{ 'backgroundColor': info.datasets[0].backgroundColor[ind] }}></div> {/*info.datasets[0].data[ind]*/} {valor}</div>
                        })}
                    </div>
                </div>
            </div>
        </MiniTarjeta>
    );
};

export default GraficoTorta;