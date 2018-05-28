import * as types from './actionTypes';
import config from '../../src/config';

import axios from 'axios';

const requestDSPChannels = () => {
  return { type: types.REQUEST_DOTSTUDIOPRO_CHANNELS_DATA };
};

const receiveDSPChannelsData = (channels, categoryOrdering) => {
  const orderedChannels = [];
  channels.map((channel, index) => {
    channel.weighting = categoryOrdering.indexOf(channel.categories[0]._id);
  });
  console.log(orderedChannels);
  orderedChannels.sort((a, b) => a.weighting - b.weighting);
  return {
    channels: channels
  };
};

const receiveDSPChannelsError = (json) => {
  return {
    error: json
  };
};

export default function loadDSPChannels(req) {
  return new Promise((resolve, reject) => {
    axios.get(`${config.api.baseUrl}/categories/US/?token=` + req.body.token)
      .then(function(response) {
        const categoryOrdering = [];
        response.data.categories.map((category, index) => {
          if (category.platforms && category.platforms[0].website && category.platforms[0].website === "true") {
            categoryOrdering.push(category._id);
          }
        });

        axios.get(`${config.api.baseUrl}/channels/US/?token=` + req.body.token + `&detail=partial`)
        .then(function(response2) {
          return resolve(receiveDSPChannelsData(response2.data.channels, categoryOrdering));
        })
        .catch(function(error) {
          console.log("Error2");
          return reject(receiveDSPChannelsError(error));
        });
      })
      .catch(function(error) {
        console.log("Error1 ", error);
        return reject(receiveDSPChannelsError(error));
      });
  });
}
