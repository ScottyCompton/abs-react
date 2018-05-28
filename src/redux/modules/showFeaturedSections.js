import * as types from '../../../api/actions/actionTypes';

const initialState = {
  sections: [],
  loaded: false,
  loading: false,
  error: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.REQUEST_SHOW_FEATURED_SECTIONS_DATA:
      return {
        ...state,
        loading: true
      };
    case types.RECEIVE_SHOW_FEATURED_SECTIONS_DATA:
      return {
        ...state,
        sections: action.result.sections,
        loaded: true,
        loading: false
      };
    case types.RECEIVE_SHOW_FEATURED_SECTIONS_ERROR:
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
  return globalState.sections && globalState.loaded;
}

export function load() {
  return {
    types: [types.REQUEST_SHOW_FEATURED_SECTIONS_DATA, types.RECEIVE_SHOW_FEATURED_SECTIONS_DATA, types.RECEIVE_SHOW_FEATURED_SECTIONS_ERROR],
    promise: (client) => client.get('/loadShowFeaturedSections')
  };
}
