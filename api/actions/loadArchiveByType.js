import * as types from './actionTypes';
import config from '../../src/config';

import axios from 'axios';

const requestArchiveData = () => {
  return {
    type: types.REQUEST_ARCHIVE_DATA
  };
};

const receiveArchiveData = (json) => {
  return {
    items: json
  };
};

const receiveArchiveDataError = (json) => {
  return {
    error: json
  };
};

export default function loadArchiveByType(req) {
  return new Promise((resolve, reject) => {
    if (!req.body.articleType) return reject(receiveArchiveDataError("Parameter 'article_type` is required for loadArchiveByType() but is missing or invalid."));

    const url = `http://${config.wpApi.baseUrl}/wp-json/dsp/v1/page/` + req.body.articleType + `s`;

    axios.get(url)
      .then((response) => {
        console.log('url', url);
        return resolve(receiveArchiveData(response.data));
      })
      .catch((response) => {
        return reject(receiveArchiveDataError(response.data));
      });
  });
}
