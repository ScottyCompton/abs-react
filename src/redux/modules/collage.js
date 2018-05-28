import * as types from '../../../api/actions/actionTypes';

const initialState = {
  collageData: {},
  loaded: false,
  loading: false,
  error: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.REQUEST_COLLAGE_DATA:
      return {
        ...state,
        loading: true,
        loaded: false
      };
    case types.RECEIVE_COLLAGE_DATA:
      return {
        ...state,
        collageData: action.result.collageData,
        loading: false,
        loaded: true
      };
    case types.RECEIVE_COLLAGE_ERROR:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      };
    default:
      return state;
  }
}

export function getCollageData(collageSlug) {
  return {
    types: [types.REQUEST_COLLAGE_DATA, types.RECEIVE_COLLAGE_DATA, types.RECEIVE_COLLAGE_ERROR],
    promise: (client) => client.post('/loadCollage', {
      data: {
        collageSlug: collageSlug
      }
    })
  };
}
