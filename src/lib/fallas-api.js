import { BASEURL } from './baseurl';

export const listarFallas = (idEmpresa) => {

	const params = {
		a: 'lf',
		e: idEmpresa
	}
	let u = new URLSearchParams(params).toString();
	const url = BASEURL + '?' + u;

	const request = {
		method: 'GET',
	};

	return fetch(url, request).then(response => response.json());
  
    /*let promise = new Promise(function(resolve, reject) {
        return resolve([{"id":"1","nombre":"Falla 1","descripcion":"descripción falla 1", "color": "#990000"},{"id":"2","nombre":"Falla 2","descripcion":"descripció falla 2", "color": "#009900"}]);
    });
    return promise;*/
};

export const altaFalla = (idEmpresa, nombre, color, nombreCorto, descripcion) => {

	const data = new FormData();
	data.append('a', 'af');
	data.append('e', idEmpresa);
	data.append('n', nombre);
	data.append('nc', nombreCorto);
	data.append('c', color);
	data.append('d', descripcion);
	
	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());

	/*let promise = new Promise(function(resolve, reject) {
        return resolve({"stat":"1"});
    });
    return promise;*/
};

export const actualizarFalla = (idEmpresa, idFalla, nombre, color, nombreCorto, descripcion) => {

	const data = new FormData();
	data.append('a', 'mf');
	data.append('id', idFalla);
	data.append('n', nombre);
	data.append('c', color);
	data.append('nc', nombreCorto);
	data.append('d', descripcion);
	
	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());

	/*let promise = new Promise(function(resolve, reject) {
        return resolve({"stat":"1"});
    });
    return promise;*/

};

export const eliminarFalla = (idFalla) => {

	const data = new FormData();
	data.append('a', 'bf');
	data.append('id', idFalla);
	
	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());

	/*let promise = new Promise(function(resolve, reject) {
        return resolve({"stat":"1"});
    });
    return promise;*/
};

export const ordenarFallas = (arrayFallas, cantidad) => {

	const data = new FormData();
	data.append('a', 'ssf');
	data.append('f', arrayFallas);
	data.append('c', cantidad);
	
	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());

	/*let promise = new Promise(function(resolve, reject) {
        return resolve({"stat":"1"});
    });
    return promise;*/
};