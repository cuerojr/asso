import { BASEURL } from './baseurl';

export const listarInformes = (idEmpresa) => {

	const params = {
		a: 'glie',
		e: idEmpresa
	}
	let u = new URLSearchParams(params).toString();
	const url = BASEURL + '?' + u;

	const request = {
		method: 'GET',
	};

	return fetch(url, request)
		.then(response => response.json());

};

export const listarInformesEmpresaSeccionServicio = (idEmpresa, idSeccion, idServicio) => {

	const params = {
		a: 'gli',
		e: idEmpresa,
		sc: idSeccion,
		sv: idServicio
	}
	let u = new URLSearchParams(params).toString();
	const url = BASEURL + '?' + u;

	const request = {
		method: 'GET',
	};

	return fetch(url, request)
		.then(response => response.json());

};

export const listarCantidadInformes = () => {

	const params = {
		a:'rci',
	}
	let u = new URLSearchParams(params).toString();
	const url = BASEURL+'?'+u;
	
	const request = {
		method: 'GET',
	};

	return fetch(url, request)
		.then(response => response.json());

};

export const getDetalleInforme = (idEmpresa, idInforme) => {

	const params = {
		a:'gdi',
		e:idEmpresa,
		i:idInforme
	}
	let u = new URLSearchParams(params).toString();
	const url = BASEURL+'?'+u;
	
	const request = {
		method: 'GET',
	};

	return fetch(url, request)
		.then(response => response.json());

};

export const altaInforme = (idEmpresa, idSeccion, idServicio, titulo, descripcion, fecha, file) => {

	const data = new FormData();
	data.append('a', 'ai');
	data.append('e', idEmpresa);
	data.append('sc', idSeccion);
	data.append('sv', idServicio);
	data.append('t', titulo);
	data.append('d', descripcion);
	data.append('f', fecha);
	data.append('file', file);
	
	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());

};

export const deleteInforme = (id) => {

	const data = new FormData();
	data.append('a', 'bi');
	data.append('id', id);
	
	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
};

export const updateInforme = (idInforme, idEmpresa, idSeccion, idServicio, titulo, descripcion, fecha, file) => {

	const data = new FormData();
	data.append('a', 'mi');
	data.append('id', idInforme);
	data.append('e', idEmpresa);
	data.append('sc', idSeccion);
	data.append('sv', idServicio);
	data.append('t', titulo);
	data.append('d', descripcion);
	data.append('f', fecha);
	data.append('file', file);
	
	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());

};