import * as types from './actionTypes';
import config from '../../src/config';

import axios from 'axios';

const requestBlogFeaturedSections = () => {
  return { type: types.REQUEST_BLOG_FEATURED_SECTIONS_DATA };
};

const receiveBlogFeaturedSections = (json) => {
  return {
    sections: json
  };
};

const receiveBlogFeaturedSectionsError = (json) => {
  return {
    error: json
  };
};

export default function loadBlogFeaturedSections(req) {
  return new Promise((resolve, reject) => {
    const url = `http://${config.wpApi.baseUrl}/wp-json/dsp/v1/featured/blog/sections`;
    axios.get(url)
      .then((response) => {
        return resolve(receiveBlogFeaturedSections(response.data));
      })
      .catch((response) => {
        return reject(receiveBlogFeaturedSectionsError(response.data));
      });
  });
}
