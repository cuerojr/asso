import { BASEURL } from './baseurl';

export const listarSecciones = (idEmpresa) => {

	const params = {
		a: 'glse',
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

export const altaSeccion = (idEmpresa, nombre, observacion) => {
	const data = new FormData();
	data.append('a', 'ase');
	data.append('e', idEmpresa);
	data.append('n', nombre);
	data.append('o', observacion);
	
	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
}

export const deleteSeccion = (idSeccion) => {
	const data = new FormData();
	data.append('a', 'bse');
	data.append('id', idSeccion);
	
	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
}

export const updateSeccion = (idSeccion,idEmpresa,nombre,observacion, estado) => {
	const data = new FormData();
	data.append('a', 'mse');
	data.append('id', idSeccion);
	data.append('e', idEmpresa);
	data.append('n', nombre);
	data.append('o', observacion);
	data.append('s', estado);
	
	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
}

export const ordenSecciones = (array) =>{
	const data = new FormData();
	data.append('a', 'sseo');
	data.append('s', array);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
}