import * as types from './actionTypes';
import config from '../../src/config';

import axios from 'axios';

const requestFeaturedOptionsData = () => {
  return { type: types.REQUEST_FEATURED_OPTIONS_DATA };
};

const receiveFeaturedOptionsData = (json) => {
  return {
    options: json
  };
};

const receiveFeaturedOptionsError = (json) => {
  return {
    error: json
  };
};

export default function loadFeaturedOptions(req) {
  return new Promise((resolve, reject) => {
    axios.get(`http://${config.wpApi.baseUrl}/wp-json/dsp/v1/featured/home/options`)
      .then(function(response) {
        return resolve(receiveFeaturedOptionsData(response.data));
      })
      .catch(function(error) {
        return reject(receiveFeaturedOptionsError(error));
      });
  });
}
