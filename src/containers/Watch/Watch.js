import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import Hero from 'components/Hero/Hero';
import ColorDiv from '../../components/ColorDiv/ColorDiv';
import WatchRail from '../../components/IVPRail/WatchRail';
import WatchList from '../../components/IVPRail/WatchList';
import { load as loadHomeChannels } from 'redux/modules/watch';
import ReactLoader from 'react-loader';

@connect(state => ({
  token: state.apiAccess.token,
  railContent: state.watch.results,
  loading: state.watch.loading,
  loaded: state.watch.loaded,
  error: state.watch.error,
}), { loadHomeChannels })

export default class Watch extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired,
    loadHomeChannels: PropTypes.func.isRequired,
    loaded: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    railContent: PropTypes.array,
    location: PropTypes.object,
    history: PropTypes.object
  };

  constructor() {
    super();
    this.state = {
      smallScreen: false,
      loaded: false,
    };
  }


  componentWillMount() {
    const { token, loaded } = this.props;
    // if (!loaded && token) this.props.loadDSPChannels(this.props.token);
    if (!loaded && token) this.props.loadHomeChannels(this.props.token);
    if (typeof window !== 'undefined') {
      window.addEventListener("resize", this.handleResize, {passive: true});
      window.addEventListener("load", this.handleResize, {passive: true});
    }
    this.handleResize();
  }

  componentDidMount() {
    localStorage.setItem('locationBack', '/watch');
    this.showLoadedContent();
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener("resize", this.handleResize);
      window.removeEventListener("load", this.handleResize);
    }
  }

  handleResize = (event) => {
    if (typeof window !== 'undefined') {
      this.setState({
        smallScreen: window.innerWidth <= 1100
      });
    }
  }

  showLoadedContent() {
    setTimeout(function() {
      this.setState({
        loaded: true,
      });
    }.bind(this), 2000);
  }

  render() {
    const { loading, loaded } = this.props;
    const heroStyles = require('../../components/Hero/Hero.less');
    const railStyles = require('../../components/IVPRail/IVPRail.less');

    let RailItems = [];
    let ListItems = [];

    if (loaded && !loading) {
      const { railContent } = this.props;
      railContent.map((item, index) => {
        if ((item && item.category && item.category.slug && item.category.slug === "featured") || (item && item.category && item.category.platforms.length && !item.category.platforms[0].website)) {
          return;
        }
          ListItems.push(
            <WatchList
              key={"watchrail" + index}
              name={item.category.name}
              slug={item.category.slug}
              content={item}
            />);
          RailItems.push(
            <WatchRail
              key={"watchrail" + index}
              name={item.category.name}
              slug={item.category.slug}
              content={item}
            />);
      });
    }

    const largeScreenContent = (
      <div className="rails">
        {RailItems}
      </div>
    );

    const smallScreenContent = (
      <div className="watchlist">
        {ListItems}
      </div>
    );

    const divStyle = {
      position: "relative",
      float: "left",
      width: "100%",
      left: "0px",
    };

    return (
      <div className="watch">
          <Helmet title="Watch"/>
            <div className="watch-content">
                <Hero category="featured"/>
                {this.state.smallScreen ? smallScreenContent : largeScreenContent}
          </div>
      </div>
    );
  }
}
