import { BASEURL } from './baseurl';

export const listarEquipos = (idEmpresa, idRuta) => {

	const params = {
		a: 'lq',
		e: idEmpresa,
	}
	if(idRuta){
		params.r = idRuta;
	}
	let u = new URLSearchParams(params).toString();
	const url = BASEURL + '?' + u;

	const request = {
		method: 'GET',
	};

	return fetch(url, request).then(response => response.json());

};

export const listarEquiposEnCargaMasiva = (idEmpresa, idCargaMasiva) => {

	const params = {
		a: 'lqcm',
		e: idEmpresa,
		cm: idCargaMasiva
	}
	let u = new URLSearchParams(params).toString();
	const url = BASEURL + '?' + u;

	const request = {
		method: 'GET',
	};

	return fetch(url, request).then(response => response.json());

};


export const altaEquipo = (idEmpresa, nombre, seccion, ruta) => {

	const data = new FormData();
	data.append('a', 'aq');
	data.append('n', nombre);
	data.append('s', seccion);
	data.append('r', ruta);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());

};

export const actualizarEquipo = (idEmpresa, idEquipo, nombre, descripcion, idSeccion, idRuta) => {

	const data = new FormData();
	data.append('a', 'mq');
	data.append('id', idEquipo);
	data.append('n', nombre);
	data.append('s', idSeccion);
	data.append('d', descripcion);
	data.append('r', idRuta);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());

};

export const eliminarEquipo = (idEquipo) => {

	const data = new FormData();
	data.append('a', 'bq');
	data.append('id', idEquipo);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());


};

export const recargarEstadosEquipo = (idEquipo) => {

	const params = {
		a: 'gdq',
		q: idEquipo
	}
	let u = new URLSearchParams(params).toString();
	const url = BASEURL + '?' + u;

	const request = {
		method: 'GET',
	};

	return fetch(url, request).then(response => response.json());

};

export const cargaMasivaDeEquipos = (equipos) => {
	const data = new FormData();
	data.append('a', 'amq');
	data.append('q', equipos);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
}