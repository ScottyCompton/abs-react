import * as types from './actionTypes';
import config from '../../src/config';

import axios from 'axios';

const requestDSPChannel = () => {
  return { type: types.REQUEST_DOTSTUDIOPRO_CHANNEL_DATA };
};

const receiveDSPChannelData = (json) => {
  return {
    channel: json.channels[0]
  };
};

const receiveDSPChannelError = (json) => {
  return {
    error: json
  };
};

export default function loadDSPChannelBySlug(req) {
  return new Promise((resolve, reject) => {
    const settings = {
      token: req.body.token,
      slug: req.body.slug,
      childSlug: req.body.childSlug
    };

    let childSlug = "";

    if (typeof settings.childSlug !== 'undefined') {
      childSlug = "/" + settings.childSlug;
    }
    axios.get(`${config.api.baseUrl}/channel/US/${settings.slug}?token=${settings.token}`)
      .then(function(response) {
        return resolve(receiveDSPChannelData(response.data));
      })
      .catch(function(error) {
        return reject(receiveDSPChannelError(error));
      });
  });
}
