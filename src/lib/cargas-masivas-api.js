import { BASEURL } from './baseurl';
import moment from 'moment';
export const listarCargasMasivas= () => {

	const params = {
		a:'lcm',
	}
	let u = new URLSearchParams(params).toString();
	const url = BASEURL+'?'+u;

	const request = {
		method: 'GET',
	};

	return fetch(url, request)
		.then(response => response.json());

};

export const altaCargaMasiva = (titulo,empresa,rutas,control,secciones, fecha) => {

	const data = new FormData();
	data.append('a', 'acm');
	data.append('t', titulo);
	data.append('e', empresa);
	data.append('r', rutas);
	data.append('s', secciones);
	data.append('c', control);
	data.append('fg', fecha);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
};

export const detalleDeComponentesYControles = (idCargaMasiva, idEquipo) => {

	const params = {
		a:'lcocm',
		id:idCargaMasiva,
		e:idEquipo
	}
	let u = new URLSearchParams(params).toString();
	const url = BASEURL+'?'+u;

	const request = {
		method: 'GET',
	};

	return fetch(url, request)
		.then(response => response.json());

};

export const eliminarCargaMasiva = (idCarga) => {

	const data = new FormData();
	data.append('a', 'bcm');
	data.append('id', idCarga);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
};

export const cargaControlPorComponente  = (idCargaMasiva, fecha, estado, componente, fallas, observaciones, recomendaciones, file) => {
	//console.log("🚀 ~ cargaControlPorComponente ~ file:", file)
	
	const data = new FormData();
	data.append('a', 'atm');
	data.append('id', idCargaMasiva);
	data.append('f', fecha);
	data.append('e', estado);
	data.append('c', componente);
	data.append('fa', fallas);
	data.append('o', observaciones);
	data.append('r', recomendaciones);
	if(file){
		file.map((archivo)=>{
			data.append('file[]', archivo);
		})
	}
	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
}

export const modificacionCargaMasiva = (idCargaMasiva, titulo, empresa, rutas, control, secciones) => {

	const data = new FormData();
	data.append('a', 'mcm');
	data.append('id', idCargaMasiva);
	data.append('t', titulo);
	data.append('e', empresa);
	data.append('r', rutas);
	data.append('s', secciones);
	data.append('c', control);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
};

export const eliminarImagenDeCargaMasiva = (idImagen) => {

	const data = new FormData();
	data.append('a', 'mbitcm');
	data.append('id', idImagen);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
};

export const finalizarCargaMasiva = (idCargaMasiva) => {

	const data = new FormData();
	data.append('a', 'fcm');
	data.append('id', idCargaMasiva);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
};

export const enviarNotificacionCliente = (idCargaMasiva) => {

	const data = new FormData();
	data.append('a', 'ncm');
	data.append('id', idCargaMasiva);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
};


export const guardarEquipoNoControlado = (idCargaMasiva, equipo, motivo, observacion, fecha) => {
	//console.log("🚀 ~ guardarEquipoNoControlado ~ equipo:", equipo)

	const data = new FormData();
	data.append('a', 'amnc');
	data.append('id', idCargaMasiva);
	data.append('e', equipo);
	data.append('m', motivo);
	data.append('o', observacion);
	data.append('f', moment(fecha).format('YYYY-MM-DD'));

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
};


export const listadoDeMotivosPorEquipoNoControlado = (empresa) => {

	const params = {
		a:'lmnc',
		e:empresa
	}
	let u = new URLSearchParams(params).toString();
	const url = BASEURL+'?'+u;

	const request = {
		method: 'GET',
	};

	return fetch(url, request)
		.then(response => response.json());

};

export const actualizarMotivosPorEquipoNoControlado = (empresa, motivos) => {

	const data = new FormData();
	data.append('a', 'umnc');
	data.append('e', empresa);
	data.append('m', motivos);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
}

export const confirmDetalleFinalizarCarga = (idCargaMasiva) => {

	const params = {
		a:'gdcm',
		id:idCargaMasiva
	}
	let u = new URLSearchParams(params).toString();
	const url = BASEURL+'?'+u;

	const request = {
		method: 'GET',
	};

	return fetch(url, request)
		.then(response => response.json());

}