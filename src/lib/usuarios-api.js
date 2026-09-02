import {
	BASEURL
} from './baseurl';

export const listarUsuarios = () => {

	const params = {
		a: 'glu',
	}
	let u = new URLSearchParams(params).toString();
	const url = BASEURL + '?' + u;

	const request = {
		method: 'GET',
	};

	return fetch(url, request)
		.then(response => response.json());

};

export const altaUsuario = (email, clave, nombre) => {
	const data = new FormData();
	data.append('a', 'au');
	data.append('e', email);
	data.append('p', clave);
	data.append('n', nombre);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
}

export const deleteUsuario = (idUsuario) => {
	const data = new FormData();
	data.append('a', 'bu');
	data.append('id', idUsuario);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
}

export const updateUsuario = (id, email, nombre, firma) => {
	const data = new FormData();
	data.append('a', 'mu');
	data.append('id', id);
	data.append('e', email);
	data.append('n', nombre);
	data.append('f', firma);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
}

export const getUsuario = (id) => {

	const params = {
		a: 'gdusr',
		id: id
	}
	let u = new URLSearchParams(params).toString();
	const url = BASEURL + '?' + u;

	const request = {
		method: 'GET',
	};

	return fetch(url, request).then(response => response.json());
};

export const actualizarPwd = (clave) => {
	const data = new FormData();
	data.append('a', 'mp');
	data.append('c', clave);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
}

export const listarUsuariosEmpleados = (idEmpresa) => {
	const params = {
		a: 'lue',
		u: idEmpresa
	}
	let u = new URLSearchParams(params).toString();
	const url = BASEURL + '?' + u;

	const request = {
		method: 'GET',
	};

	return fetch(url, request)
		.then(response => response.json());
}

export const getUsuarioEmpresa = (id) => {
	const params = {
		a: 'gdue',
		id: id
	}
	let u = new URLSearchParams(params).toString();
	const url = BASEURL + '?' + u;

	const request = {
		method: 'GET',
	};

	return fetch(url, request).then(response => response.json());
};

export const updateUsuarioEmpresa = ({
	id,
	email,
	nombre,
	acccesoInformes,
	accesoMensajes,
	accesoNotificaciones,
	secciones,
	servicios = ["54"]
}) => {
	const data = new FormData();
	data.append('a', 'mue');
	data.append('id', id);
	data.append('e', email);
	data.append('n', nombre);
	data.append('i', acccesoInformes);
	data.append('m', accesoMensajes);
	data.append('t', accesoNotificaciones);
	data.append('s', JSON.stringify(secciones));
	data.append('sv', JSON.stringify(servicios));

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
}