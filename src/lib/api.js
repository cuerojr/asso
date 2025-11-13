import { BASEURL } from './baseurl';

export const loginUser= (user, pas) => {
	const data = new FormData();
	data.append('a', 'li');
	data.append('f', 'a');
	data.append('u', user);
	data.append('p', pas);
	
	
	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());

};

export const logOutUser= () => {
	const data = new FormData();
	data.append('a', 'lo');
	
	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());

};

export const recuperarPwd= (email) => {
	const data = new FormData();
	data.append('a', 'msc');
	data.append('email', email);
	return fetch(BASEURL, {
		method: 'POST',
		body: data
	}).then(response => response.json());

};