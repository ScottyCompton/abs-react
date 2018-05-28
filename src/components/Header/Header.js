import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { browserHistory } from 'react-router';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import 'babel-polyfill';
import { FormattedMessage } from 'react-intl';
import theme from 'theme/theme';
import { load as loadFeaturedOptions } from 'redux/modules/featuredOptions';
import SmallScreenHeader from '../../components/Header/SmallScreenHeader';
import LargeScreenHeader from '../../components/Header/LargeScreenHeader';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // React Transitions API

@connect(state => ({
  options: state.featuredOptions.options,
  loaded: state.featuredOptions.loaded,
  loading: state.featuredOptions.loading,
  error: state.featuredOptions.error
}), { loadFeaturedOptions })

export default class Header extends Component {
  static propTypes = {
    loadFeaturedOptions: PropTypes.func.isRequired,
    options: PropTypes.object,
    loading: PropTypes.bool,
    loaded: PropTypes.bool,
    error: PropTypes.object,
    location: PropTypes.object.isRequired,
    showSmallScreenHeader: PropTypes.bool.isRequired,
    showLargeScreenHeader: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (this.props.error || !this.props.loaded) {
      this.props.loadFeaturedOptions();
    }
  }


  render() {
      const {location, showSmallScreenHeader, showLargeScreenHeader} = this.props;
      const t = true;
    return (
      <span className="globalHeader">
        {showSmallScreenHeader && <SmallScreenHeader location={location} />}
        <LargeScreenHeader location={location} showHeader={showLargeScreenHeader} />
      </span>
    );
  }
}
