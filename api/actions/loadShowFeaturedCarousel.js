import * as types from './actionTypes';
import config from '../../src/config';

import axios from 'axios';

const requestShowFeaturedCarousel = () => {
  return { type: types.REQUEST_BLOG_FEATURED_CAROUSEL_DATA };
};

const receiveShowFeaturedCarousel = (json) => {
  return {
    slides: json
  };
};

const receiveShowFeaturedCarouselError = (json) => {
  return {
    error: json
  };
};

export default function loadShowFeaturedCarousel(req) {
  return new Promise((resolve, reject) => {
    const url = `http://${config.wpApi.baseUrl}/wp-json/dsp/v1/featured/show/carousel`;
    axios.get(url)
      .then((response) => {
        return resolve(receiveShowFeaturedCarousel(response.data));
      })
      .catch((response) => {
        return reject(receiveShowFeaturedCarouselError(response.data));
      });
  });
}
