import { BASEURL } from './baseurl';

export const listarRutas = (idEmpresa) => {

	const params = {
		a: 'lr',
		e: idEmpresa
	}
	let u = new URLSearchParams(params).toString();
	const url = BASEURL + '?' + u;

	const request = {
		method: 'GET',
	};

	return fetch(url, request).then(response => response.json());
};

export const altaRuta = (idEmpresa, nombre, descripcion) => {

	const data = new FormData();
	data.append('a', 'ar');
	data.append('n', nombre);
	data.append('d', descripcion);
	data.append('e', idEmpresa);
	
	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());

};

export const actualizarRuta = (idEmpresa, idRuta, nombre, descripcion) => {

	const data = new FormData();
	data.append('a', 'mr');
	data.append('n', nombre);
	data.append('d', descripcion);
	data.append('id', idRuta);
	
	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
};

export const eliminarRuta = (idRuta) => {

	const data = new FormData();
	data.append('a', 'br');
	data.append('id', idRuta);
	
	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());

};

export const ordenarRutas = (arrayRutas) => {

	const data = new FormData();
	data.append('a', 'ssr');
	data.append('r', arrayRutas);
	
	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
};