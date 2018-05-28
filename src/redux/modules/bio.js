import * as types from '../../../api/actions/actionTypes';

const initialState = {
  bio: [],
  loaded: false,
  loading: false,
  error: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.REQUEST_BIO_DATA:
      return {
        ...state,
        loading: true
      };
    case types.RECEIVE_BIO_DATA:
      return {
        ...state,
        bio: action.result.bio,
        loaded: true,
        loading: false
      };
    case types.RECEIVE_BIO_ERROR:
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
  return globalState.bio && globalState.loaded;
}

export function load(slug, location) {
  let parsedSlug = slug;
  if (location.indexOf('/host') > -1) {
    parsedSlug = "host";
  } else if (location.indexOf('/judge') > -1) {
    parsedSlug = "judges";
  }
  return {
    types: [types.REQUEST_BIO_DATA, types.RECEIVE_BIO_DATA, types.RECEIVE_BIO_ERROR],
    promise: (client) => client.get('/loadBio?slug=' + parsedSlug)
  };
}
