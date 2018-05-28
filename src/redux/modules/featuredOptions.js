import * as types from '../../../api/actions/actionTypes';

const initialState = {
  options: {},
  loaded: false,
  loading: false,
  error: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.REQUEST_FEATURED_OPTIONS_DATA:
      return {
        ...state,
        loading: true
      };
    case types.RECEIVE_FEATURED_OPTIONS_DATA:
      return {
        ...state,
        options: action.result.options,
        loaded: true,
        loading: false
      };
    case types.RECEIVE_FEATURED_OPTIONS_ERROR:
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
  return globalState.apiAccess && globalState.apiAccess.token && globalState.categories && globalState.categories.loaded;
}

export function load() {
  return {
    types: [types.REQUEST_FEATURED_OPTIONS_DATA, types.RECEIVE_FEATURED_OPTIONS_DATA, types.RECEIVE_FEATURED_OPTIONS_ERROR],
    promise: (client) => client.get('/loadFeaturedOptions')
  };
}
