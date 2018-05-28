import * as types from '../../../api/actions/actionTypes';

const initialState = {
  images: [],
  loaded: false,
  loading: false,
  error: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.REQUEST_INSTAGRAM_DATA:
      return {
        ...state,
        loading: true
      };
    case types.RECEIVE_INSTAGRAM_DATA:
      return {
        ...state,
        images: action.result.data,
        loaded: true,
        loading: false
      };
    case types.RECEIVE_INSTAGRAM_ERROR:
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

export function load(account) {
  return {
    types: [types.REQUEST_INSTAGRAM_DATA, types.RECEIVE_INSTAGRAM_DATA, types.RECEIVE_INSTAGRAM_ERROR],
    promise: (client) => client.post('/loadInstagramPosts', {
      data: {
        account: account
      }
    })
  };
}
