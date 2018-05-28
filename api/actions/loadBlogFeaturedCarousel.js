import * as types from './actionTypes';
import config from '../../src/config';

import axios from 'axios';

const requestBlogFeaturedCarousel = () => {
  return { type: types.REQUEST_BLOG_FEATURED_CAROUSEL_DATA };
};

const receiveBlogFeaturedCarousel = (json) => {
  return {
    slides: json
  };
};

const receiveBlogFeaturedCarouselError = (json) => {
  return {
    error: json
  };
};

export default function loadBlogFeaturedCarousel(req) {
  return new Promise((resolve, reject) => {
    const url = `http://${config.wpApi.baseUrl}/wp-json/dsp/v1/featured/blog/carousel`;
    axios.get(url)
      .then((response) => {
        return resolve(receiveBlogFeaturedCarousel(response.data));
      })
      .catch((response) => {
        return reject(receiveBlogFeaturedCarouselError(response.data));
      });
  });
}
