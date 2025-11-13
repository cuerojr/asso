import { BASEURL } from './baseurl';

export const introduccionInformeOnline= (idEmpresa, idInforme) => {

	const params = {
		a:'gdii',
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


export const informeInformeOnline= (idEmpresa, idInforme) => {

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

export const altaInformeTipoOnline = (idEmpresa, secciones, rutas, titulo, descripcion, mesDesde, anioDesde, mesHasta, anioHasta, controlId, introduccion, planta, atencionLinea1, atencionLinea2, atencionLinea3, referencia, firma, datosOpcionales, guardar) => {

	const data = new FormData();
	data.append('a', 'aio');
	data.append('e', idEmpresa);
	data.append('sc', secciones);//array de secciones
	data.append('rt', rutas);//array de rutas
	if(titulo){
		data.append('t', titulo);//obligatorio si va a guardar
	}
	if(descripcion){
		data.append('d', descripcion);//opcional
	}
	data.append('dm', mesDesde);//formato MM
	data.append('da', anioDesde);
	data.append('hm', mesHasta);//formato MM
	data.append('ha', anioHasta);
	data.append('c', controlId);
	//data.append('sv', tipoControl);
	
	if(introduccion){
		data.append('i', introduccion);//obligatorio si va a guardar
	}
	if(planta){
	data.append('p', planta);//opcional
	}
	if(atencionLinea1){
	data.append('at1', atencionLinea1);//opcional
	}
	if(atencionLinea2){
	data.append('at2', atencionLinea2);//opcional
	}
	if(atencionLinea3){
	data.append('at3', atencionLinea3);//opcional
	}
	if(referencia){
	data.append('r', referencia);//opcional
	}
	if(firma){
	data.append('f', firma);//opcional
	}
	if(datosOpcionales){
	data.append('o', datosOpcionales);//opcional
	}
	data.append('s', guardar);//opcional 0/1
	
	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
};


export const updateInformeTipoOnline = (idInforme, idEmpresa, secciones, titulo, descripcion, mesDesde, anioDesde, mesHasta, anioHasta, controlId, introduccion, planta, atencionLinea1, atencionLinea2, atencionLinea3, referencia, firma, datosOpcionales, guardar) => {

	const data = new FormData();
	data.append('a', 'mio');
	data.append('id', idInforme);
	data.append('e', idEmpresa);
	data.append('sc', secciones);//array de secciones
	if(titulo){
		data.append('t', titulo);//obligatorio si va a guardar
	}
	if(descripcion){
		data.append('d', descripcion);//opcional
	}
	data.append('dm', mesDesde);//formato MM
	data.append('da', anioDesde);
	data.append('hm', mesHasta);//formato MM
	data.append('ha', anioHasta);
	data.append('c', controlId);
	if(introduccion){
		data.append('i', introduccion);//obligatorio si va a guardar
	}
	if(planta){
	data.append('p', planta);//opcional
	}
	if(atencionLinea1){
	data.append('at1', atencionLinea1);//opcional
	}
	if(atencionLinea2){
	data.append('at2', atencionLinea2);//opcional
	}
	if(atencionLinea3){
	data.append('at3', atencionLinea3);//opcional
	}
	if(referencia){
	data.append('r', referencia);//opcional
	}
	if(firma){
	data.append('f', firma);//opcional
	}
	if(datosOpcionales){
	data.append('o', datosOpcionales);//opcional
	}
	data.append('s', guardar);//opcional 0/1
	
	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
};


export const getResumenDeEstado = (idEmpresa, idInforme) => {
	const params = {
		a:'gri',
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
}

export const getResumenDeAdmin = (idEmpresa, idInforme) => {
	const params = {
		a:'grra',
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
}

export const getFallas = (idEmpresa, idInforme) => {
	const params = {
		a:'gfi',
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
}

export const borrarInformeOnline = (idInforme) => {
	const data = new FormData();
	data.append('a', 'bi');
	data.append('id', idInforme);
	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
}

export const modificacionPublicShare = (idInforme, idEmpresa, ps) =>{
	const data = new FormData();
	data.append('a', 'mpsi');
	data.append('id', idInforme);
	data.append('e', idEmpresa);
	data.append('ps', ps);
	
	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());

}

export const enviarInformePorEmail = (idInforme, idEmpresa, eMails) => {
	const data = new FormData();
	data.append('a', 'spsi');
	data.append('id', idInforme);
	data.append('e', idEmpresa);
	data.append('em', eMails);
	
	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());

}