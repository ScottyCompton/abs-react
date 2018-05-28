import * as types from './actionTypes';
import config from '../../src/config';

import axios from 'axios';

const requestPostData = () => {
  return {
    type: types.REQUEST_POST_DATA
  };
};

const receivePostData = (json) => {
  return {
    content: json
  };
};

const receivePostDataError = (json) => {
  return {
    error: json
  };
};

export default function loadPostBySlug(req) {
  return new Promise((resolve, reject) => {
    if (!req.body.slug) return reject(receivePostDataError("Parameter slug required for loadPostBySlug() missing."));

    const url = `http://${config.wpApi.baseUrl}/wp-json/dsp/v1/post/byslug/` + req.body.slug;

    axios.get(url)
      .then((response) => {
        return resolve(receivePostData(response.data));
      })
      .catch((response) => {
        console.log(response);
        return reject(receivePostDataError(response.data));
      });
  });
}
