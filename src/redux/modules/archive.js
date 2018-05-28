import * as types from '../../../api/actions/actionTypes';

const initialState = {
  items: [],
  loaded: false,
  loading: false,
  error: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.REQUEST_ARCHIVE_DATA:
      return {
        ...state,
        loading: false
      };
    case types.RECEIVE_ARCHIVE_DATA:
      return {
        ...state,
        items: action.result.items,
        loaded: true
      };
    case types.RECEIVE_ARCHIVE_ERROR:
      return {
        ...state,
        loaded: true,
        error: action.error
      };
    default:
      return state;
  }
}

export function load(articleType) {
  return {
    types: [types.REQUEST_ARCHIVE_DATA, types.RECEIVE_ARCHIVE_DATA, types.RECEIVE_ARCHIVE_ERROR],
    promise: (client) => client.post('/loadArchiveByType', {
      data: {
        articleType: articleType
      }
    })
  };
}
