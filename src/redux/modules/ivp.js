import * as types from '../../../api/actions/actionTypes';

const initialState = {
  channel: {},
  loaded: false,
  loading: false,
  error: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.REQUEST_DOTSTUDIOPRO_CHANNEL_DATA:
      return {
        ...state,
        loading: true
      };
    case types.RECEIVE_DOTSTUDIOPRO_CHANNEL_DATA:
      return {
        ...state,
        channel: action.result.channel,
        loaded: true,
        loading: false
      };
    case types.RECEIVE_DOTSTUDIOPRO_CHANNEL_ERROR:
      return {
        ...state,
        loaded: true,
        loading: false,
        error: action.error
      };
    case types.RECEIVE_CLEAR_IVP_CONTENT:
      return { ...initialState };
    default:
      return state;
  }
}

export function load(token, slug, childSlug) {
  return {
    types: [types.REQUEST_DOTSTUDIOPRO_CHANNEL_DATA, types.RECEIVE_DOTSTUDIOPRO_CHANNEL_DATA, types.RECEIVE_DOTSTUDIOPRO_CHANNEL_ERROR],
    promise: (client) => client.post('/loadDSPChannelBySlug', {
      data: {
        token: token,
        slug: slug,
        childSlug: childSlug
      }
    })
  };
}

export function cleanIVP() {
  return {
    types: [types.REQUEST_CLEAR_IVP_CONTENT, types.RECEIVE_CLEAR_IVP_CONTENT],
    promise: (client) => client.get('/cleanIVPContent', {})
  };
}
