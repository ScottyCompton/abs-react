import * as types from './actionTypes';

import axios from 'axios';

const requestInstagramData = () => {
  return {
    type: types.REQUEST_INSTAGRAM_DATA
  };
};

const receiveInstagramData = (json) => {
  return {
    data: json
  };
};

const receiveInstagramError = (json) => {
  return {
    error: json
  };
};

export default function loadInstagramPosts(req) {
  return new Promise((resolve, reject) => {
    if (!req.body.account) return reject(receiveInstagramError("Paramter 'account' is required for loadInstagramPosts() but is missing."));

    const url = `https://www.instagram.com/${req.body.account}/?__a=1`;

    axios.get(url)
      .then((response) => {
        return resolve(receiveInstagramData(response.data.user.media.nodes));
      })
      .catch((response) => {
        return reject(receiveInstagramError(response.data));
      });
  });
}
