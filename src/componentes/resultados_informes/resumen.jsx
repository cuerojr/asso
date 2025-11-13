import React, { Fragment, useEffect, useState } from 'react';
import { Row, Col, Table } from "reactstrap";
import { fetchlistarEstados } from '../../reducers/estados-reducer';
import { connect } from 'react-redux';
import { MiniTarjeta } from './miniTarjeta';
import GraficoTorta from './graficoTorta';
import { Bar, Line } from 'react-chartjs-2';
import { pickTextColorBasedOnBgColorSimple, transpose } from '../utils/utils';
import { getResumenDeEstado } from '../../lib/informe-online-api';


const options = {
  legend: {
    display: false,
    align: 'left',
    position: 'bottom',
    maxWidth: 50
  },
  responsive: false,
  maintainAspectRatio: false
}

const opcionesBarra = {
  responsive: true,
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

const opcionesLinea = {
  responsive: true,
  scales: { xAxes: [{ gridLines: { display: false } }], yAxes: [{ gridLines: { display: true } }] },
  legend: {
    display: false
  },
  elements:{
    line:{
      tension:0
    },
    point: {
      radius:8,
      backgroundColor:'rgba(255, 255, 255, 1)'
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

const Resumen = (props) => {
  
  const [resumenDeEstados, setResumenDeEstados] = useState({});
  const [detalleEstados, setDetalleEstados] = useState([])
  const [totalesPeriodoLineas, setTotalesPeriodoLineas] = useState({})
  const [detalleEquipos, setDetalleEquipos] = useState([])
  const [tortasEstados, setTortasEstados] = useState([])
  
  useEffect(() => {
    props.fetchlistarEstados(props.idEmpresa);

  }, [])

  useEffect(() => {
    const distribuirDatos = (datos) =>{
      setResumenDeEstados(datos);
      setDetalleEstados(transpose(datos.detalle_estados))
      setTotalesPeriodoLineas(datos.totales_periodo_lineas)
      datos.totales_periodo_lineas.datasets.forEach((element)=>{
        element.backgroundColor = "rgba(255, 255, 255, 0)"
      })
      setDetalleEquipos(transpose(datos.detalle_equipos));
      datos.tortas_estados.forEach(element => {
        if(element.labels.length == undefined){
          element.labels = Object.values(element.labels)
        }
        if(element.datasets.backgroundColor && element.datasets.backgroundColor.length == undefined){
          element.datasets.backgroundColor = Object.values(element.datasets.backgroundColor)
        }
        if(element.datasets.borderColor && element.datasets.borderColor.length == undefined){
          element.datasets.borderColor = Object.values(element.datasets.borderColor)
        }
        if(element.datasets.data && element.datasets.data.length == undefined){
          element.datasets.data = Object.values(element.datasets.data)
        }
        window.tortas_estados = datos.tortas_estados;
        
      });
      setTortasEstados(datos.tortas_estados);
    }

    if (props.currentTab == 'resumen de estados') {
      if(props.idInforme){
        getResumenDeEstado(props.idEmpresa, props.idInforme).then((res) => {
          distribuirDatos(res)
        })
      }else{
        distribuirDatos(props.resumenTab)
      }
    }
  }, [props.currentTab])

  return (
    <Fragment>
      <Row>
        <Col><h3 className='font-weight-bold'>EQUIPOS CONTROLADOS / NO CONTROLADOS</h3></Col>
      </Row>
      <Row>
        <Col md="3">
          {resumenDeEstados.totales_periodo && <GraficoTorta info={resumenDeEstados.totales_periodo} options={options} />}
        </Col>
        <Col md="9">
          <MiniTarjeta classes='mr-2 mt-3 textCenter'>
            {resumenDeEstados.totales_periodo_barras && <Bar options={opcionesBarra} data={resumenDeEstados.totales_periodo_barras} height={128} />} ;
          </MiniTarjeta>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col className="mt-4"><h3 className='font-weight-bold'>RESUMEN DE EQUIPOS CONTROLADOS</h3></Col>
      </Row>
      <Row className='mb-3'>
        <Col>
          <Table responsive className='table table-bordered mt-4 table-informes'>
            <tbody>
              {detalleEstados && detalleEstados.map((tb, index) => {
                return <tr key={index} style={{ "backgroundColor": detalleEstados[index][0], "color": pickTextColorBasedOnBgColorSimple(detalleEstados[index][0], "#FFFFFF", "#000000") }}>
                  {detalleEstados[index].map((tab, indice) => {
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
            <h3 className='font-weight-bold mt-3 mb-5 color-azul'>TENDENCIA DE ESTADOS GLOBALES</h3>
            {totalesPeriodoLineas && totalesPeriodoLineas > 0 && <Line options={opcionesLinea} data={totalesPeriodoLineas} height={50} />}
          </MiniTarjeta>
        </Col>
      </Row>
      <Row>
        {tortasEstados && tortasEstados.map((el, index) => {
          return <Col sm='6' md='3' key={index}>
            <GraficoTorta info={el} options={options} />
          </Col>
        })}
      </Row>
      <Row>
        <Col>
          <Table responsive className='table table-bordered mt-4 table-informes'>
            <tbody>
              {detalleEquipos && detalleEquipos.map((tr, index) => {
                return <tr key={index}>
                  {detalleEquipos[index].map((tab, indice) => {
                      let fragmento;
                      if (index == 0) {
                        fragmento = <th className={indice > 1 ? 'color-azul-fondo text-white text-center' : 'color-azul-fondo text-white text-left'} key={indice}>{tab}</th>
                      } else {
                        if(tab[0] == '#'){
                          fragmento = <td key={indice} style={{"backgroundColor":tab}}> &nbsp; </td>
                        }else{
                          fragmento = <td key={indice}> {tab}</td>
                        }
                        
                      }
                      return (fragmento)
                  })}</tr>
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table responsive className='table table-bordered mt-4 table-informes'>
            <thead>
              <tr className='color-azul-fondo'>
                <th colSpan={3} className="text-white">REFERENCIAS</th>
              </tr>
            </thead>
            <tbody>
              {props.estados && props.estados.map((estado, ind) => {
                return <tr key={ind}>
                  <td className="text-center" style={{ "backgroundColor": estado.color, "width": "60px" }}><span style={{ "color": pickTextColorBasedOnBgColorSimple(estado.color, "#FFFFFF", "#000000") }}>{estado.nombre_corto}</span></td>
                  <td style={{ "width": "10%" }}>{estado.nombre}</td>
                  <td>{estado.descripcion}</td>
                </tr>
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    estados: state.estadosReducer.estados,
  }
}
export default connect(
  //función que mapea propiedades del state con propiedades del componente
  mapStateToProps,
  //mapeo de funciones
  { fetchlistarEstados }
)(Resumen);

