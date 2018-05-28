import * as types from './actionTypes';
import config from '../../src/config';
import querystring from 'querystring';

import axios from 'axios';

const requestEmailSubscribe = () => {
  return { type: types.REQUEST_MAILCHIMP_SUBSCRIBE };
};

const receiveEmailSubscribe = (json) => {
  return {
    response: json
  };
};

const emailSubscribeFailed = (json) => {
  return {
    error: json
  };
};

export default function subscribeEmailToMailchimp(req) {
  return new Promise((resolve, reject) => {
    // HTTP basic auth requires an encoded Mailchimp API Key as PW
    const authString = Buffer.from("abs:" + config.mailchimpAPIKey).toString('base64');
    console.log("Trying to do a thing...");
    axios.post(
      "https://us16.api.mailchimp.com/3.0/lists/28635a1711/members",
        { email_address: req.body.email, status: 'subscribed'},
        { headers: { 'Authorization': 'Basic ' + authString }})
        .then(function(response) {
          return resolve(receiveEmailSubscribe(response.data));
      })
      .catch(function(error) {
        if (error.response && error.response.status === 400) {
          console.log("MC 400");
          return resolve(receiveEmailSubscribe(error.response.data));
        }
        return reject(emailSubscribeFailed(error));
      });
  });
}
