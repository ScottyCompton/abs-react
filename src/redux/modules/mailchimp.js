import * as types from '../../../api/actions/actionTypes';

const initialState = {
  loaded: false,
  error: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.REQUEST_MAILCHIMP_SUBSCRIBE:
      return {
        ...state
      };
    case types.RECEIVE_MAILCHIMP_SUBSCRIBE:
      return {
        ...state,
        response: action.result.response,
        loaded: true,
        error: null
      };
    case types.RECEIVE_MAILCHIMP_ERROR:
      return {
        ...state,
        loaded: false,
        error: action.error
      };
    default:
      return state;
  }
}

export function subscribeEmailToMailchimp(email) {
  return {
    types: [types.REQUEST_MAILCHIMP_SUBSCRIBE, types.RECEIVE_MAILCHIMP_SUBSCRIBE, types.RECEIVE_MAILCHIMP_ERROR],
    promise: (client) => client.post('/subscribeEmailToMailchimp', {
      data: {
        email: email
      }
    })
  };
}
