import * as types from './actionTypes';
import config from '../../src/config';

import axios from 'axios';

const requestCleanPostBySlug = () => {
  return {
    type: types.CLEAN_POST_DATA
  };
};

const clearPostBySlug = () => {
  return {
    content: null,
    loaded: false,
    loading: false,
    error: null
  };
};

export default function cleanPostBySlug() {
  return new Promise((resolve, reject) => {
    return resolve(clearPostBySlug());
  });
}
