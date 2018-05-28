import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { browserHistory } from 'react-router';
import { Link } from 'react-router';


export default class HeaderLink extends Component {
  static propTypes = {
    location: PropTypes.string.isRequired,
    linkTo: PropTypes.string.isRequired,
    linkName: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {location, linkTo, linkName} = this.props;
    let strActivePath = linkTo;
    let strActiveClassName = "";
    let strLocation = location;
    if (strLocation.substring(0, 1) === '/') {
      strLocation = strLocation.substring(1, strLocation.length);
    }
    const aryLocation = strLocation.split('/');

    if (strActivePath.substring(0, 1) === '/') {
      strActivePath = strActivePath.substring(1, linkTo.length);
    }
    const aryActivePath = strActivePath.split('/');

    if (aryActivePath[aryActivePath.length-1] === "" && aryActivePath.length > -1) {
      aryActivePath.pop();
    }
    if (aryActivePath.length === 0) {
      aryActivePath.push("");
    }

    if (aryActivePath[0] === aryLocation[0]) {
      strActiveClassName = "active";
    }
    return (<span><Link to={linkTo} className={strActiveClassName}>{linkName}</Link></span>);
  }

}
