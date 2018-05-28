import * as types from './actionTypes';
import config from '../../src/config';

import axios from 'axios';

const requestSearchResults = () => {
  return { type: types.REQUEST_SEARCH_DATA };
};

const receiveSearchResults = (json) => {
  return {
    articles: json.wordpress,
    videos: json.dsp
  };
};

const receiveSearchResultsError = (json) => {
  return {
    error: json
  };
};

export default function search(req) {
  return new Promise((resolve, reject) => {
    const url = `http://${config.wpApi.baseUrl}/wp-json/dsp/v1/search/${req.body.query}`;
    axios.get(url)
      .then((response) => {
        return resolve(receiveSearchResults(response.data));
      })
      .catch((error) => {
        return reject(receiveSearchResultsError(error.data));
      });
  });
}
