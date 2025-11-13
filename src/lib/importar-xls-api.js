import { BASEURL } from './baseurl';


export const altaMasivaEquiposExcel = (id, file) => {
	const data = new FormData();
	data.append('a', 'iexls');
	data.append('e', id);
	data.append('file', file);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
}

export const altaMasivaEquiposExcelSegundaEtapa = (id, token) => {
	const data = new FormData();
	data.append('a', 'iexls');
    data.append('e', id);
    data.append('s', 1);
	data.append('ft', token);

	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());
}

