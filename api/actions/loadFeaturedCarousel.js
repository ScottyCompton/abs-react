import * as types from './actionTypes';
import config from '../../src/config';

import axios from 'axios';

const requestFeaturedCarousel = () => {
  return { type: types.REQUEST_FEATURED_CAROUSEL_DATA };
};

const receiveFeaturedCarousel = (json) => {
  return {
    slides: json
  };
};

const receiveFeaturedCarouselError = (json) => {
  return {
    error: json
  };
};

export default function loadFeaturedCarousel(req) {
  return new Promise((resolve, reject) => {
    const url = `http://${config.wpApi.baseUrl}/wp-json/dsp/v1/featured/home/carousel`;
    axios.get(url)
      .then((response) => {
        return resolve(receiveFeaturedCarousel(response.data));
      })
      .catch((response) => {
        console.log("response", response);
        return reject(receiveFeaturedCarouselError(response.data));
      });
  });
}
