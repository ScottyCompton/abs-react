import * as types from './actionTypes';

import axios from 'axios';

const requestClearRandom = () => {
  return {
    type: types.REQUEST_CLEAR_RANDOM
  };
};

const clearArticles = () => {
  return {
    items: [],
    loaded: false,
    loading: false,
    error: null
  };
};

export default function clearRandomArticles() {
  return new Promise((resolve, reject) => {
    return resolve(clearArticles());
  });
}
