import * as types from './actionTypes';
import config from '../../src/config';

import axios from 'axios';

const requestWatchRailData = () => {
  return {
    type: types.REQUEST_WATCH_RAILS
  };
};

const receiveWatchRailData = (json) => {
  return {
    results: json
  };
};

const receiveWatchRailError = (json) => {
  return {
    error: json
  };
};

export default function loadWatchRails(req) {
  return new Promise((resolve, reject) => {
    if (req.body.token) {
      axios.get(`${config.api.baseUrl}/homepage?token=${req.body.token}`)
        .then( function(response) {
          return resolve(response.data.homepage);
        })
        .catch( function(error) {
          return reject(receiveHomeRailError(error));
        });
    } else {
      return reject(receiveHomeRailError({
        message: 'Missing token in call to loadHomeRails().'
      }));
    }
  });
}
