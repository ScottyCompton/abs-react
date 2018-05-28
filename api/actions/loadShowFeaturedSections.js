import * as types from './actionTypes';
import config from '../../src/config';

import axios from 'axios';

const requestShowFeaturedSections = () => {
  return { type: types.REQUEST_SHOW_FEATURED_SECTIONS_DATA };
};

const receiveShowFeaturedSections = (json) => {
  return {
    sections: json
  };
};

const receiveShowFeaturedSectionsError = (json) => {
  return {
    error: json
  };
};

export default function loadShowFeaturedSections(req) {
  return new Promise((resolve, reject) => {
    const url = `http://${config.wpApi.baseUrl}/wp-json/dsp/v1/featured/show/sections`;
    axios.get(url)
      .then((response) => {
        return resolve(receiveShowFeaturedSections(response.data));
      })
      .catch((response) => {
        return reject(receiveShowFeaturedSectionsError(response.data));
      });
  });
}
