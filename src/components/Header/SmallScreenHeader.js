import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { browserHistory } from 'react-router';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import 'babel-polyfill';
import { FormattedMessage } from 'react-intl';
import ShareIcon from 'material-ui-community-icons/icons/share-variant';
import TransitionGroup from 'react-addons-transition-group';
import HeaderLink from '../Header/HeaderLink';
import { load as loadFeaturedOptions } from 'redux/modules/featuredOptions';
import NavSlider from '../../components/NavSlider/NavSlider';
import ShareMenu from './ShareMenu';

@connect(state => ({
  options: state.featuredOptions.options,
  loaded: state.featuredOptions.loaded,
  loading: state.featuredOptions.loading,
  error: state.featuredOptions.error
}), { loadFeaturedOptions })

export default class LargeScreenHeader extends Component {
  static propTypes = {
    loadFeaturedOptions: PropTypes.func.isRequired,
    options: PropTypes.object,
    loading: PropTypes.bool,
    loaded: PropTypes.bool,
    error: PropTypes.object,
    location: PropTypes.object.isRequired
  };

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    const { location} = this.props;
      if (this.props.loaded) {
        return (
        <div className="smallScreenHeader">
          <div className="headerTop">
            <div className="lifetimeLogo">
              <img src="https://d1bud3tr8474k6.cloudfront.net/wp-content/uploads/2017/08/18163329/lifetimelogo.png" className="img img-fluid" />
            </div>
            <div className="absLogo">
              <Link to="/"><img src="https://d1bud3tr8474k6.cloudfront.net/wp-content/uploads/2017/09/15152555/abscolorlogo2.png" className="img img-fluid" /></Link>
            </div>
            <div className="shareIcon">
              <ShareMenu />
            </div>
          </div>
          <div className="headerNav"><NavSlider location={location} /></div>
        </div>);
      } else {
        return (<div></div>);
      }
  }
}
