import { BASEURL } from './baseurl';

export const listarClientes= () => {

	const params = {
		a:'gle',
	}
	let u = new URLSearchParams(params).toString();
	const url = BASEURL+'?'+u;

	const request = {
		method: 'GET',
	};

	return fetch(url, request)
		.then(response => response.json());

};

export const listarCantidadClientes= () => {

	const params = {
		a:'rce',
	}
	let u = new URLSearchParams(params).toString();
	const url = BASEURL+'?'+u;

	const request = {
		method: 'GET',
	};

	return fetch(url, request)
		.then(response => response.json());

};

export const detalleCliente= (idEmpresa) => {

	const params = {
		a:'gde',
		e:idEmpresa
	}
	let u = new URLSearchParams(params).toString();
	const url = BASEURL+'?'+u;

	const request = {
		method: 'GET',
	};

	return fetch(url, request)
		.then(response => response.json());

};



export const altaCliente = (email, nombre, responsable, numeroContratoVigente, tituloContrato, descripcion) => {

	const data = new FormData();
	data.append('a', 'ae');
	data.append('e', email);
	data.append('n', nombre);
	data.append('r', responsable);
	data.append('c', numeroContratoVigente);
	data.append('t', tituloContrato);
	data.append('d', descripcion);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
};


export const updateCliente = (id, email, nombre, responsable, numeroContratoVigente, tituloContrato, descripcion) => {

	const data = new FormData();
	data.append('a', 'me');
	data.append('id', id);
	data.append('e', email);
	data.append('n', nombre);
	data.append('r', responsable);
	data.append('c', numeroContratoVigente);
	data.append('t', tituloContrato);
	data.append('d', descripcion);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
};


export const deleteCliente = (id) => {

	const data = new FormData();
	data.append('a', 'be');
	data.append('id', id);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
};


export const habilitarDeshabilitarCliente = (id,h) => {
	const data = new FormData();
	data.append('a', 'mhe');
	data.append('id', id);
	data.append('h', h);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
}

/* esto notifica al cliente de su creación */
export const notificarCliente = (id) => {
	const data = new FormData();
	data.append('a', 'mae');
	data.append('id', id);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
}

/*envia notificacion */
export const enviarNotificacionCliente = (id, asunto, texto, file) => {
	const data = new FormData();
	data.append('a', 'an');
	data.append('e', id);
	data.append('s', asunto);
	data.append('t', texto);
	data.append('file', file);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
}

export const listarNotificaciones= (idEmpresa) => {

	const params = {
		a:'ln',
		sm:"1",
		p:0,
		id:idEmpresa
	}
	let u = new URLSearchParams(params).toString();
	const url = BASEURL+'?'+u;

	const request = {
		method: 'GET',
	};

	return fetch(url, request)
		.then(response => response.json());

};

export const getDetalleNotificaciones = (idNotificacion) => {

	const params = {
		a:'gnd',
		id:idNotificacion
	}
	let u = new URLSearchParams(params).toString();
	const url = BASEURL+'?'+u;

	const request = {
		method: 'GET',
	};

	return fetch(url, request)
		.then(response => response.json());
}

export const deleteNotificacion = (idNotificacion) => {
	const data = new FormData();
	data.append('a', 'bn');
	data.append('id', idNotificacion);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
}