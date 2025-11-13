import React, { Fragment, useEffect, useState } from 'react';
import { Row, Col, Table } from "reactstrap";
import { MiniTarjeta } from './miniTarjeta';
import { Line, Bar } from 'react-chartjs-2';
import { getFallas } from '../../lib/informe-online-api';
import { pickTextColorBasedOnBgColorSimple, transpose } from '../utils/utils';

const FallasConsulta = (props) => {

    const [resumenFallas, setResumenFallasFun] = useState([]);
    const [totalPeriodoLineas, setTotalPeriodoLineas] = useState(null);
    const [barrasFallas, setBarrasFallas] = useState([])

    const datosBarras = new Array();
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    const opcionesLinea = {
        responsive: true,
        scales: { xAxes: [{ gridLines: { display: false } }], yAxes: [{ gridLines: { display: true } }] },
        legend: {
            display: false
        },
        elements: {
            line: {
                tension: 0
            },
            point: {
                radius: 8,
                backgroundColor: 'rgba(255, 255, 255, 1)'
            },
        },
        plugins: {
            legend: {
                position: 'bottom',
                align: 'end'
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart',
            },

        },
    };

    /* Array.from(Array(12), (el, ind) => {
        datosBarras.push({
            labels: [
                "Desbalanceo",
                "Desalineación",
                "Rod. Motor",
                "Rod. Ventilador",
                "Rod. Bomba",                    // dates
                "Rod. Otras",
                "Engrane",
                "Lubricaciones",
                "Juego Mecánico"
            ],
            datasets: [
                {
                    label: 'Equipos controlados',
                    data: [
                        20, 15, 20, 22, 25, 40, 30, 30, 20
                    ],
                    backgroundColor: ['#7bca3c', '#FF00FF', '#5430AD', '#F164FF', '#FFC664', '#70BF75', '#1EDED4', '#E6B79D', '#A0054C'],
                },
            ],
        })
    }) */

    const opcionesBarra = {
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    userCallback: function(label, index, labels) {
                        if (Math.floor(label) === label) {
                            return label;
                        }
                    },
                }
            }],
        },
        legend: {
            display: false,
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
                text: 'Chart.js Bar Chart',
            },
        },
    };


    useEffect(() => {
        const distribuirDatos = (datos) =>{
            setResumenFallasFun(transpose(datos.resumen_fallas));
            datos.totales_periodo_lineas.datasets.forEach((element) => {
                element.backgroundColor = "rgba(255, 255, 255, 0)"
            })
            setTotalPeriodoLineas(datos.totales_periodo_lineas);
            setBarrasFallas(datos.barras_fallas);
        }
        if (props.currentTab == 'fallas') {
            if (props.idInforme) {
                getFallas(props.idEmpresa, props.idInforme).then((res) => {
                    distribuirDatos(res)
                })
            } else {
                distribuirDatos(props.fallasTab)
            }
        }
    }, [props.currentTab])

    return (
        <Fragment>
            <Row>
                <Col><h3 className='font-weight-bold'>RESUMEN DE FALLAS</h3></Col>
            </Row>
            <Row>
                <Col>
                    <Table responsive className='table table-bordered mt-4 table-informes'>
                        <tbody>
                            {resumenFallas && resumenFallas.map((tb, index) => {
                                return <tr key={index} style={{ "backgroundColor": resumenFallas[index][0], "color": pickTextColorBasedOnBgColorSimple(resumenFallas[index][0], "#FFFFFF", "#000000") }}>
                                    {resumenFallas[index].map((tab, indice) => {
                                        if (indice > 0) {
                                            let fragmento;
                                            if (index == 0) {
                                                fragmento = <th className={indice > 1 ? 'color-azul-fondo text-white text-center' : 'color-azul-fondo text-white text-left'} key={indice}>{tab}</th>
                                            } else {
                                                fragmento = <td key={indice}> <div className={indice > 1 ? 'text-center' : 'text-left'} dangerouslySetInnerHTML={{ __html: tab }} /></td>
                                            }
                                            return (fragmento)
                                        }
                                    })}</tr>
                            })}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col>
                    <MiniTarjeta classes='mr-2 mt-3 '>
                        <h3 className='font-weight-bold mt-3 mb-5 color-azul'>TENDENCIA DE TIPOS DE FALLAS</h3>
                        {totalPeriodoLineas && <Line options={opcionesLinea} data={totalPeriodoLineas} height={50} />}
                    </MiniTarjeta>
                </Col>
            </Row>
            <Row>
                {barrasFallas.map((bar, ind) => {
                    let data = Object.values(bar.datasets.data)
                    let datos = {
                        labels: bar.labels,
                        datasets: [{
                            data: data,
                            backgroundColor: bar.datasets.backgroundColor
                        }]
                    }
                    return (<Col md="6" key={ind}>
                        <MiniTarjeta classes='mr-2 mt-3 textCenter'>
                            <h3 className='font-weight-bold mt-3 mb-5 color-azul' style={{ "textTransform": "uppercase" }}>{bar.titulo}</h3>
                            <Bar options={opcionesBarra} data={datos} height={128} />
                        </MiniTarjeta>
                    </Col>)
                })}
            </Row>
        </Fragment>
    );
};

export default FallasConsulta;