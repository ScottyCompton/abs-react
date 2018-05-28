import * as types from './actionTypes';
import config from '../../src/config';

import axios from 'axios';

const requestCollageData = () => {
  return {
    type: types.REQUEST_COLLAGE_DATA
  };
};

const receiveCollageData = (json) => {
  return {
    collageData: json[0]
  };
};

const receiveCollageDataError = (json) => {
  return {
    error: json
  };
};

export default function loadCollage(req) {
  return new Promise((resolve, reject) => {
    if (!req.body.collageSlug) return reject(receiveCollageDataError("Parameter required for loadCollage() missing." + req.body.collageSlug));
    const url = `http://${config.wpApi.baseUrl}/wp-json/dsp/v1/collage/byslug/`  + req.body.collageSlug;

    axios.get(url)
      .then((response) => {
        return resolve(receiveCollageData(response.data));
      })
      .catch((response) => {
        return reject(receiveCollageDataError(response.data));
      });
  });
}
