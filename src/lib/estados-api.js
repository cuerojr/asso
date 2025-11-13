import { BASEURL } from './baseurl';

export const listarEstados = (idEmpresa) => {

	const params = {
		a: 'le',
		e: idEmpresa
	}
	let u = new URLSearchParams(params).toString();
	const url = BASEURL + '?' + u;

	const request = {
		method: 'GET',
	};

	return fetch(url, request).then(response => response.json());
  
    /*let promise = new Promise(function(resolve, reject) {
        return resolve([{"id":"1","nombre":"Estado 1","descripcion":"sarasa", "color": "#990000"},{"id":"2","nombre":"Estado 2","descripcion":"1965", "color": "#009900"}]);
    });
    return promise;*/
};

export const altaEstado = (idEmpresa, nombre, color, descripcion, nombreCorto) => {

	const data = new FormData();
	data.append('a', 'as');
	data.append('e', idEmpresa);
	data.append('n', nombre);
	data.append('c', color);
	data.append('d', descripcion);
	data.append('nc', nombreCorto);
	
	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());

	/*let promise = new Promise(function(resolve, reject) {
        return resolve({"stat":"1"});
    });
    return promise;
*/
};

export const actualizarEstado = (idEmpresa, idEstado, nombre, color, descripcion, nombreCorto) => {

	const data = new FormData();
	data.append('a', 'ms');
	data.append('id', idEstado);
	data.append('n', nombre);
	data.append('c', color);
	data.append('d', descripcion);
	data.append('nc', nombreCorto);
	
	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());

};

export const eliminarEstado = (idEstado) => {

	const data = new FormData();
	data.append('a', 'bs');
	data.append('id', idEstado);
	
	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
};

export const ordenarEstados = (arrayEstados, cantidad) => {

	const data = new FormData();
	data.append('a', 'sse');
	data.append('s', arrayEstados);
	data.append('c', cantidad);
	
	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
};