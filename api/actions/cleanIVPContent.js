import * as types from './actionTypes';
import config from '../../src/config';

const requestIVPVideo = () => {
  return {
    type: types.REQUEST_CLEAN_IVP_CONTENT
  };
};

const receiveCleanIVPContent = () => {
  return {
    channel: {}
  };
};


export default function cleanIVPContent(req) {
  return new Promise((resolve, reject) => {
    return resolve(receiveCleanIVPContent());
  });
}
