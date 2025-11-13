import { BASEURL } from './baseurl';

export const listarComponentes = (idEmpresa, idEquipo) => {

	const params = {
		a: 'lco',
		e: idEquipo
	}
	let u = new URLSearchParams(params).toString();
	const url = BASEURL + '?' + u;

	const request = {
		method: 'GET',
	};

	return fetch(url, request).then(response => response.json());

    /*let promise = new Promise(function(resolve, reject) {
        return resolve([{"id":"1","nombre":"Nombre componente", "descripcion":"observaciones 1", "vibraciones":{"fecha":"2021-01-19","estado":"normal","color":"#FF0000"}, "termografia":{"fecha":"2021-01-19","estado":"normal","color":"#FF0000"}},
                        {"id":"2","nombre":"Nombre componente 2", "cantidad_termografia":"199", "descripcion":"observaciones 2", "vibraciones":{"fecha":"2021-01-19","estado":"normal","color":"#FF0000"}, "termografia":{"fecha":"2021-01-19","estado":"normal","color":"#FF0000"}}]);

    });
    return promise;*/
};

export const altaComponente = (idEquipo, nombre, descripcion, bajaRPM) => {

	const data = new FormData();
	data.append('a', 'ac');
	data.append('n', nombre);
	data.append('d', descripcion);
	data.append('e', idEquipo);
	data.append('rpm', bajaRPM);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());

};

export const actualizarComponente = (idEquipo, idComponente, nombre, descripcion, bajaRPM) => {

	const data = new FormData();
	data.append('a', 'mc');
	data.append('n', nombre);
	data.append('d', descripcion);
	data.append('e', idEquipo);
	data.append('id', idComponente);
	data.append('rpm', bajaRPM);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());

};

export const eliminarComponente = (idComponente) => {

	const data = new FormData();
	data.append('a', 'bc');
	data.append('id', idComponente);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
};