import { BASEURL } from './baseurl';

export const listarAutocompletar= (tipo) => {
	const params = {
		a:'lor',
        k:tipo
	}
	let u = new URLSearchParams(params).toString();
	const url = BASEURL+'?'+u;

	const request = {
		method: 'GET',
	};

	return fetch(url, request)
		.then(response => response.json());

};

export const ordenarAutocompletar = (arrayElementos) => {
	const data = new FormData();
	data.append('a', 'soro');
	data.append('t', arrayElementos);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
};

export const altaAutocompletar = (texto,nombreCorto,tipo) => {
	const data = new FormData();
	data.append('a', 'aor');
	data.append('t', texto);
	data.append('nc', nombreCorto);
	data.append('k', tipo);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
};

export const bajaAutocompletar = (id) => {
	const data = new FormData();
	data.append('a', 'bor');
	data.append('id', id);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
};


export const updateAutocompletar = (id,nombreCorto, texto) => {
	const data = new FormData();
	data.append('a', 'mro');
	data.append('id', id);
	data.append('t', texto);
	data.append('nc', nombreCorto);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
};
