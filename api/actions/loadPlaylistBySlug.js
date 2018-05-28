import * as types from './actionTypes';
import config from '../../src/config';

import axios from 'axios';

const requestRailPlaylistData = () => {
  return {
    type: types.REQUEST_WATCH_RAIL_PLAYLIST
  };
};

const receiveRailPlaylistData = (json) => {
  let playlist = [];
  if (json.channels[0].childchannels && json.channels[0].childchannels.length > 0 && json.channels[0].childchannels[0] && json.channels[0].childchannels[0].playlist) {
    playlist = json.channels[0].childchannels[0].playlist;
  } else {
    playlist = json.channels[0].playlist;
  }
  return {
    payload: playlist,
    channel_slug: json.channels[0].slug,
    slug: json.category[0].slug
  };
};

const receivePlaylistError = (json) => {
  return {
    error: json
  };
};

// some rails on the home page have just a single channel with a playlist inside
// for these we need to get a different call to get the playlist data
export default function loadPlaylistBySlug(req) {
  return new Promise((resolve, reject) => {
    const settings = {
      token: req.body.token,
      slug: req.body.slug
    };
    // requestRailPlaylistData();

    if (settings.token && settings.slug) {
      axios.get(`${config.api.baseUrl}/channels/US/${settings.slug}?token=${settings.token}`)
        .then( function(response) {
          return resolve(receiveRailPlaylistData(response.data));
        })
        .catch( function(error) {
          console.log("ERROR: ", error);
          return reject(receivePlaylistError(error));
        });
    } else {
      return reject(receivePlaylistError({
        message: 'Missing required parameters in call to get Rail Playlist data for home page.'
      }));
    }
  });
}
