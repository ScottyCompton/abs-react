import * as types from '../../../api/actions/actionTypes';

const initialState = {
  results: [],
  loading: false,
  loaded: false,
  error: null,
  loading_playlists: false,
  loaded_playlists: false
};

export default function reducer(state = initialState, action = {}) {
  const newState = {...state};

  switch (action.type) {
    case types.REQUEST_WATCH_RAILS: {
      newState.loading = true;
      break;
    }
    case types.RECEIVE_WATCH_RAILS_ERROR: {
      newState.loading = false;
      newState.error = action.result;
      break;
    }
    case types.RECEIVE_WATCH_RAILS_DATA: {
      newState.loading = false;
      newState.loaded = true;
      newState.results = action.result;
      break;
    }

    case types.REQUEST_WATCH_RAIL_PLAYLIST: {
      newState.loading_playlists = true;
      break;
    }

    // if the rail had a playlist we will need to change the data structure a bit
    // to make sure it matches what the rail component expects
    case types.RECEIVE_WATCH_RAIL_PLAYLIST_DATA: {
      const thisSeriesTitle = action.result.payload[0].seriestitle; // for display series title on home carousel

        const videosToRail = action.result.payload.map((video) => {
            return {
              id: video._id,
              spotlight_poster: "//f9q4g5j6.ssl.hwcdn.net/" + video.thumb,
              slug: "/" +  action.result.slug + "/video/" + video._id,
              child_slug: action.result.slug,
              channel_slug: action.result.channel_slug,
              title: video.title,
              videoUrl: "/watch/" +  action.result.channel_slug + "/video/" + video._id,
              seriesTitle: video.seriestitle,
              description: video.description
            };
          });
      newState[action.result.slug] = {};
      newState[action.result.slug].results = videosToRail;
      newState[action.result.slug].loading_playlists = false;
      newState[action.result.slug].loaded_playlists = true;
      break;
    }

    default : return newState;
  }
  return newState;
}

export function load(token) {
  return {
    types: [types.REQUEST_WATCH_RAILS, types.RECEIVE_WATCH_RAILS_DATA, types.RECEIVE_WATCH_RAILS_ERROR],
    promise: (client) => client.post('/loadWatchRails', {
      data: {
        token: token
      }
    })
  };
}

export function loadPlaylist(token, slug) {
  return {
    types: [types.REQUEST_WATCH_RAIL_PLAYLIST, types.RECEIVE_WATCH_RAIL_PLAYLIST_DATA, types.RECEIVE_WATCH_RAIL_PLAYLIST_ERROR],
    promise: (client) => client.post('/loadPlaylistBySlug', {
      data: {
        token: token,
        slug: slug
      }
    })
  };
}
