import * as types from '../../../api/actions/actionTypes';

const initialState = {
  content: {},
  loaded: false,
  loading: false,
  error: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.REQUEST_POST_DATA:
      return {
        ...state,
        loading: true
      };
    case types.RECEIVE_POST_DATA:
      return {
        ...state,
        content: action.result.content,
        loaded: true,
        loading: false
      };
    case types.RECEIVE_POST_DATA_ERROR:
      return {
        ...state,
        loaded: true,
        loading: false,
        error: action.error
      };
    case types.CLEAN_POST_DATA:
      return {
        ...state,
        loaded: false,
        loading: false
      };
    default:
      return state;
  }
}

export function load(slug) {
  return {
    types: [types.REQUEST_POST_DATA, types.RECEIVE_POST_DATA, types.RECEIVE_POST_DATA_ERROR],
    promise: (client) => client.post('/loadPostBySlug', {
      data: {
        slug: slug
      }
    })
  };
}

export function clean() {
  return {
    types: [types.CLEAN_POST_DATA],
    promise: (client) => client.post('/cleanPostBySlug', {
      data: {
        type: "Clean"
      }
    })
  };
}
