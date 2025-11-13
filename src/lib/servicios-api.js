import { BASEURL } from './baseurl';

export const listarServicios= () => {

	const params = {
		a: 'glsv',
	}
	let u = new URLSearchParams(params).toString();
	const url = BASEURL + '?' + u;

	const request = {
		method: 'GET',
	};

	return fetch(url, request)
		.then(response => response.json());

};

export const listarServiciosPorSeccion= (idSeccion) => {

	const params = {
		a: 'glsvxse',
		se:idSeccion
	}
	let u = new URLSearchParams(params).toString();
	const url = BASEURL + '?' + u;

	const request = {
		method: 'GET',
	};

	return fetch(url, request)
		.then(response => response.json());

};


export const altaServicio = (nombreServicio) => {
	const data = new FormData();
	data.append('a', 'asv');
	data.append('sv', nombreServicio);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());

};

export const deleteServicio = (idServicio) => {
	const data = new FormData();
	data.append('a', 'bsv');
	data.append('id', idServicio);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());

};

export const ordenServicios = (array) =>{
	const data = new FormData();
	data.append('a', 'ssvo');
	data.append('s', array);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
}