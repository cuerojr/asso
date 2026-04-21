import {
	BASEURL
} from './baseurl';
import moment from 'moment';

const handleResponse = async (response) => {
	const text = await response.text();
	try {
		const data = JSON.parse(text);

		if (data.stat === 0 || data.error) {
			throw new Error(data.err || data.error || 'Error en la operación');
		}

		return data;
	} catch (parseError) {
		if (parseError instanceof SyntaxError) {
			// Ahora sí, detecta si es HTML
			if (text.includes('<br />') || text.includes('<html>') || text.includes('Fatal error')) {
				console.error('⚠️ El servidor devolvió HTML en lugar de JSON:', text);
				throw new Error('Error del servidor PHP. Revisa los logs.');
			}
			console.error('❌ Error al parsear JSON:', text);
			throw new Error('Respuesta inválida del servidor');
		}
		throw parseError;
	}
};


export const listarControles = (idEmpresa, idEquipo, idComponente) => {

	const params = {
		a: 'lt',
		c: idComponente
	}
	let u = new URLSearchParams(params).toString();
	const url = BASEURL + '?' + u;

	const request = {
		method: 'GET',
	};

	return fetch(url, request).then(response => response.json());

};

export const altaControl = (tipoTest, idEstado, idComponente, fecha, fallas, observaciones, recomendaciones, file) => {

	const data = new FormData();
	data.append('a', 'at');
	data.append('t', tipoTest);
	data.append('e', idEstado);
	data.append('c', idComponente);
	data.append('f', fecha);
	data.append('fa', fallas);
	data.append('o', observaciones);
	data.append('r', recomendaciones);
	if (file) {
		file.map((archivo) => {
			data.append('file[]', archivo);
		})
	}
	//data.append('file[]', file);


	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());

};

export const actualizarControl = ({
	idControl,
	idTipoTest,
	idEstado,
	idComponente,
	fecha,
	fallas,
	observaciones,
	recomendaciones,
	reporte,
	file
}) => {

	const data = new FormData();
	data.append('a', 'mt');
	data.append('id', idControl);
	data.append('t', idTipoTest);
	data.append('e', idEstado);
	data.append('c', idComponente);
	data.append('f', fecha);
	data.append('fa', fallas);
	data.append('o', observaciones);
	data.append('r', recomendaciones);
	if (file) {
		file.map((archivo) => {
			data.append('file[]', archivo);
		})
	}

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(handleResponse);
};

export const recargarEstadosControl = (idComponente) => {
	const data = new FormData();
	data.append('a', 'gdc');
	data.append('c', idComponente);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
}

export const eliminarControl = (idTest) => {

	const data = new FormData();
	data.append('a', 'bt');
	data.append('id', idTest);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
};

export const listarTipoTesteos = () => {

	const params = {
		a: 'lc',
	}
	let u = new URLSearchParams(params).toString();
	const url = BASEURL + '?' + u;

	const request = {
		method: 'GET',
	};

	return fetch(url, request).then(response => response.json());
}

export const eliminarImagenControl = (idImagen) => {

	const data = new FormData();
	data.append('a', 'mbit');
	data.append('id', idImagen);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
}

export const guardarEquipoNoControladoIndividual = (equipo, motivo, observacion, fecha, idEmpresa) => {

	const data = new FormData();
	data.append('a', 'amnc');
	data.append('id', 0);
	data.append('e', equipo);
	data.append('m', motivo);
	data.append('n', idEmpresa);
	data.append('o', observacion);
	data.append('f', moment(fecha).format('YYYY-MM-DD'));

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
};