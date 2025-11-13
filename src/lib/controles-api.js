import { BASEURL } from './baseurl';
import moment from 'moment';
export const listarControles = (idEmpresa, idEquipo, idComponente) => {

	const params = {
		a: 'lt',
	    c:idComponente
	}
	let u = new URLSearchParams(params).toString();
	const url = BASEURL + '?' + u;

	const request = {
		method: 'GET',
	};

	return fetch(url, request).then(response => response.json());
  /*
    let promise = new Promise(function(resolve, reject) {
        return resolve([{"id":"1","nombre":"Control de Vibraciones","fecha":"2021-11-10","estado":"normal", "recomendaciones":"recomendacion 1", "observaciones":"observaciones 1", "reporte":"reporte 1", "color_estado":"#990000", "file":"http://www.rutaarchivo/nombre.jpg"},
                        {"id":"2","nombre":"Termografía","fecha":"2021-11-10","estado":"normal", "recomendaciones":"recomendacion 2", "observaciones":"observaciones 2", "reporte":"reporte 2", "color_estado":"#009900", "file":"http://www.rutaarchivo/nombre.jpg"}]);

    });
    return promise;*/
};

export const altaControl = (tipoTest, idEstado, idComponente, fecha, fallas, observaciones, recomendaciones, file) => {

	const data = new FormData();
	data.append('a', 'at');
	data.append('t', tipoTest);
	data.append('e', idEstado);
	data.append('c', idComponente);
	data.append('f', fecha);
	data.append('fa', fallas);
	data.append('o', observaciones);
	data.append('r', recomendaciones);
	if(file){
		file.map((archivo)=>{
			data.append('file[]', archivo);
		})
	}
	//data.append('file[]', file);


	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());

};

export const actualizarControl = (idControl, idTipoTest, idEstado, idComponente, fecha, fallas, observaciones, recomendaciones, reporte, file) => {

	const data = new FormData();
	data.append('a', 'mt');
	data.append('id',idControl);
	data.append('t',idTipoTest);
	data.append('e',idEstado);
	data.append('c',idComponente);
	data.append('f',fecha);
	data.append('fa',fallas);
	data.append('o',observaciones);
	data.append('r',recomendaciones);
	data.append('p',reporte);
	file.map((archivo)=>{
		data.append('file[]', archivo);
	})

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());

};

export const recargarEstadosControl = (idComponente) => {
	const data = new FormData();
	data.append('a', 'gdc');
	data.append('c', idComponente);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
}

export const eliminarControl = (idTest) => {

	const data = new FormData();
	data.append('a', 'bt');
	data.append('id', idTest);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
};

export const listarTipoTesteos = () => {

	const params = {
		a: 'lc',
	}
	let u = new URLSearchParams(params).toString();
	const url = BASEURL + '?' + u;

	const request = {
		method: 'GET',
	};

	return fetch(url, request).then(response => response.json());
}

export const eliminarImagenControl = (idImagen) => {

	const data = new FormData();
	data.append('a', 'mbit');
	data.append('id', idImagen);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
}

export const guardarEquipoNoControladoIndividual = (equipo, motivo, observacion, fecha, idEmpresa) => {

	const data = new FormData();
	data.append('a', 'amnc');
	data.append('id', 0);
	data.append('e', equipo);
	data.append('m', motivo);
	data.append('n', idEmpresa);
	data.append('o', observacion);
	data.append('f', moment(fecha).format('YYYY-MM-DD'));

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
};