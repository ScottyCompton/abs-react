import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router';

const NotFoundStyle = {
  error: {
    height: "50vh",
    background: "#333",
    paddingTop: "80px"
  },
  h1: {
    fontSize: "70px",
    color: "white"
  },
  p: {
    color: "white"
  }
};

export default class NotFound extends Component {

  static propTypes = {
    location: PropTypes.object
  };

  render() {
    console.log("Location", this.props.location.pathname);
    return (
      <div style={NotFoundStyle.error}>
        <div className="container">
          <h1 style={NotFoundStyle.h1}>404.</h1>
          <p style={NotFoundStyle.p}>Sorry, the content you are looking for no longer seems to be here.</p>
        </div>
      </div>
    );
  }
}
