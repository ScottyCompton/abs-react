import * as types from '../../../api/actions/actionTypes';

const initialState = {
  items: [],
  loaded: false,
  loading: false,
  error: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.REQUEST_RANDOM_POSTS_DATA:
      return {
        ...state,
        loading: false
      };
    case types.RECEIVE_RANDOM_POSTS_DATA:
      return {
        ...state,
        items: action.result.items,
        loaded: true
      };
    case types.RECEIVE_RANDOM_POSTS_ERROR:
      return {
        ...state,
        loaded: true,
        error: action.error
      };
    case types.RECEIVE_CLEAR_RANDOM:
      return {
        ...initialState
      };
    default:
      return state;
  }
}

export function getRandom(articleType) {
  return {
    types: [types.REQUEST_RANDOM_POSTS_DATA, types.RECEIVE_RANDOM_POSTS_DATA, types.RECEIVE_RANDOM_POSTS_ERROR],
    promise: (client) => client.post('/loadRandomArticles', {
      data: {
        articleType: articleType
      }
    })
  };
}

export function clearRandom() {
  return {
    types: [types.REQUEST_CLEAR_RANDOM, types.RECEIVE_CLEAR_RANDOM, types.RECEIVE_CLEAR_RANDOM_ERROR],
    promise: (client) => client.get('/clearRandomArticles', {})
  };
}
