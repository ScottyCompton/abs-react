import * as types from './actionTypes';
import config from '../../src/config';

import axios from 'axios';

const requestRandomPosts = () => {
  return {
    type: types.REQUEST_RANDOM_POSTS_DATA
  };
};

const receiveRandomPosts = (json) => {
  return {
    items: json
  };
};

const receiveRandomPostsError = (json) => {
  return {
    error: json
  };
};

export default function loadRandomArticles(req) {
  return new Promise((resolve, reject) => {
    if (!req.body.articleType) return reject(receiveRandomPostsError("Parameter required for loadRandomArticles() missing."));
    const slug = req.body.articleSlug || '';

    const url = `http://${config.wpApi.baseUrl}/wp-json/dsp/v1/random/` + req.body.articleType + '/6/';

    axios.get(url)
      .then((response) => {
        return resolve(receiveRandomPosts(response.data));
      })
      .catch((response) => {
        return reject(receiveRandomPostsError(response.data));
      });
  });
}
