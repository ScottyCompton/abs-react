import * as types from './actionTypes';
import config from '../../src/config';

import axios from 'axios';

const requestBio = () => {
	return {
		type: types.REQUEST_BIO_DATA
	};
};

const receiveBio = (json) => {
	return {
		bio: json.constructor === Array ? json : [json]
	};
};

const receiveBioError = (json) => {
	return {
		error: json
	};
};

export default function loadBio(req) {
	let slug = req.query.slug;
	let url = "";
	if (slug === 'host') {
		url = `http://${config.wpApi.baseUrl}/wp-json/dsp/v1/page/host`;
	} else if (slug === 'judges') {
		url = `http://${config.wpApi.baseUrl}/wp-json/dsp/v1/page/judges/active`;
	} else {
		url = `http://${config.wpApi.baseUrl}/wp-json/dsp/v1/page/contestants/active`;
	}
	return new Promise((resolve, reject) => {
		axios.get(url)
			.then((response) => {
				return resolve(receiveBio(response.data));
			})
			.catch((response) => {
				return reject(receiveBioError(response.data));
			});
	});
}