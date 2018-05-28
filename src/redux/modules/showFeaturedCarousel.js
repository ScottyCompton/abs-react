import * as types from '../../../api/actions/actionTypes';

const initialState = {
  slides: [],
  loaded: false,
  loading: false,
  error: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.REQUEST_SHOW_FEATURED_CAROUSEL_DATA:
      return {
        ...state,
        loading: true
      };
    case types.RECEIVE_SHOW_FEATURED_CAROUSEL_DATA:
      return {
        ...state,
        slides: action.result.slides,
        loaded: true,
        loading: false
      };
    case types.RECEIVE_SHOW_FEATURED_CAROUSEL_ERROR:
      return {
        ...state,
        loaded: true,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.slides && globalState.loaded;
}

export function load() {
  return {
    types: [types.REQUEST_SHOW_FEATURED_CAROUSEL_DATA, types.RECEIVE_SHOW_FEATURED_CAROUSEL_DATA, types.RECEIVE_SHOW_FEATURED_CAROUSEL_ERROR],
    promise: (client) => client.get('/loadShowFeaturedCarousel')
  };
}
