import * as types from '../../../api/actions/actionTypes';

const initialState = {
  videos: [],
  articles: [],
  error: null,
  reset: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.RECEIVE_SEARCH_DATA:
      return {
        ...state,
        articles: action.result.articles,
        videos: action.result.videos
      };
    case types.RECEIVE_SEARCH_ERROR:
      return {
        ...state,
        error: action.error
      };

    /* Resets */
    case types.REQUEST_SEARCH_RESET:
      return {
        ...state,
        reset: true
      };
    case types.RECEIVE_SEARCH_RESET:
      return {
        ...initialState,
        reset: false
      };
    case types.RECEIVE_SEARCH_RESET_ERROR:
      return {
        ...state,
        reset: false
      };
    default:
      return state;
  }

  return state;
}

export function search(query) {
  return {
    types: [types.REQUEST_SEARCH_DATA, types.RECEIVE_SEARCH_DATA, types.RECEIVE_SEARCH_ERROR],
    promise: (client) => client.post('/search', {
      data: {
        query: query
      }
    })
  };
}

export function resetSearchGrid() {
  return {
    types: [types.REQUEST_SEARCH_RESET, types.RECEIVE_SEARCH_RESET, types.RECEIVE_SEARCH_RESET_ERROR],
    promise: (client) => client.get('/searchReset')
  };
}
