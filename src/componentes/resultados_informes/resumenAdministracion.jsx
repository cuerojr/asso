import React, { Fragment, useEffect, useState } from 'react';
import { Row, Col, Table } from "reactstrap";
import { fetchlistarEstados } from '../../reducers/estados-reducer';
import { connect } from 'react-redux';
import { MiniTarjeta } from './miniTarjeta';
import GraficoTortaAdministracion from './graficoTortaAdministracion';

import { Bar } from 'react-chartjs-2';
import { transpose } from '../utils/utils';
import { getResumenDeAdmin } from '../../lib/informe-online-api';


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

const ResumenAdministracion = (props) => {  
  
  const [resumenDeEstados, setResumenDeEstados] = useState({});
  //const [detalleEstados, setDetalleEstados] = useState([])
  //const [totalesPeriodoLineas, setTotalesPeriodoLineas] = useState({})
  const [detalleEquipos, setDetalleEquipos] = useState([]);
  const [detalleSecciones, setDetalleSecciones] = useState([]);
  //const [tortasEstados, setTortasEstados] = useState([])
  
  useEffect(() => {
    props.fetchlistarEstados(props.idEmpresa);
  }, [])

  useEffect(() => {

    const distribuirDatos = (datos) =>{
      setResumenDeEstados(datos);
      setDetalleEquipos(transpose(datos.detalle_equipos));
      setDetalleSecciones(transpose(datos.detalle_secciones));      
    }

    if (props.currentTab == 'resumen de administracion') {
      if(props.idInforme){
        getResumenDeAdmin(props.idEmpresa, props.idInforme).then((res) => {
          distribuirDatos(res)
        })
      } else {
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
          {resumenDeEstados.totales_periodo && <GraficoTortaAdministracion info={resumenDeEstados.totales_periodo} options={options} />}
        </Col>
        <Col md="9">
          <MiniTarjeta classes='mr-2 mt-3 textCenter'>
            {resumenDeEstados.totales_periodo_barras && <Bar options={opcionesBarra} data={resumenDeEstados.totales_periodo_barras} height={128} />} ;
          </MiniTarjeta>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col className="mt-4"><h3 className='font-weight-bold'>RESUMEN DE EQUIPOS CONTROLADOS / NO CONTROLADOS MES A MES</h3></Col>
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

      <Row className="mt-5">
        <Col className="mt-4"><h3 className='font-weight-bold'>RESUMEN DE EQUIPOS CONTROLADOS / NO CONTROLADOS POR SECCIONES</h3></Col>
      </Row>

      <Row>
        <Col>
        <Table responsive className='table table-bordered mt-4 table-informes'>
            <tbody>
              {detalleSecciones && detalleSecciones.map((tr, index) => {
                return <tr key={index}>
                  {detalleSecciones[index].map((tab, indice) => {
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
)(ResumenAdministracion);

