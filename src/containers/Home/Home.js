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
import HomeFeaturedSlider from '../../components/HomeFeaturedSlider/HomeFeaturedSlider';
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
      ListItems.push(<HomeFeaturedSlider key={"homefeaturedsliderlist"} />);
      RailItems.push(<HomeFeaturedSlider key={"homefeaturedsliderrail"} />);
      railContent.map((item, index) => {
        if ((item && item.category && item.category.slug && item.category.slug === "featured") || (item && item.category && item.category.platforms.length && !item.category.platforms[0].website)) {
          return;
        }
        ListItems.push(
          <WatchList
            key={"watchlist:" + index}
            name={item.category.name}
            slug={item.category.slug}
            content={item}
          />);
        RailItems.push(
          <WatchRail
            key={"watchrail:" + index}
            name={item.category.name}
            slug={item.category.slug}
            content={item}
          />);
      });
    }

    const largeScreenContent = (
      <div className="rails" key="0">
        {RailItems}
      </div>
    );

    const smallScreenContent = (
      <div className="watchlist" key="1">
        {ListItems}
      </div>
    );

    const divStyle = {
      position: "relative",
      float: "left",
      width: "100%",
      left: "0px",
    };

    // moved sponsor links from footer to home page
    const footerTopMargin = location.pathname === "/watch" || location.pathname === "/" ? "0" : "5vh";

    return (
      <div className="home">
          <Helmet title="Home"/>
            <div className={this.state.smallScreen ? "home-content smallScreen" : "home-content largeScreen"}>
                <Hero category="featured"/>
                {this.state.smallScreen ? smallScreenContent : largeScreenContent}
          </div>

          <div className="footerSponsorContainer" style={{marginTop: footerTopMargin}}>
            <div className="footerSponsorsTitle"><h1><a href="/pages/sponsors">Visit Our Sponsors</a></h1></div>
            <div className="footerSponsors">
              <div className="sponsor"><Link to="http://fave4.com/" target="_blank"><img src="https://d1bud3tr8474k6.cloudfront.net/wp-content/uploads/2017/09/17194615/fave4-logo2.jpg" className="img img-fluid" /></Link></div>
              <div className="sponsor"><Link to="https://www.orlybeauty.com/" target="_blank"><img src="https://d1bud3tr8474k6.cloudfront.net/wp-content/uploads/2017/09/17194620/orly-logo2.jpg" className="img img-fluid" /></Link></div>
              <div className="sponsor"><Link to="http://www.shophudabeauty.com" target="_blank"><img src="https://d1bud3tr8474k6.cloudfront.net/wp-content/uploads/2017/09/17194618/huda-logo2.jpg" className="img img-fluid" /></Link></div>
              <div className="sponsor"><Link to="http://www.glamcor.com/" target="_blank"><img src="https://d1bud3tr8474k6.cloudfront.net/wp-content/uploads/2017/09/17194617/glamcor-logo2.jpg" className="img img-fluid" /></Link></div>
              <div className="sponsor"><Link to="https://www.colorwowhair.com/" target="_blank"><img src="https://d1bud3tr8474k6.cloudfront.net/wp-content/uploads/2017/09/17194621/wow1.jpg" className="img img-fluid" /></Link></div>
              <div className="sponsor"><Link to="https://www.fhibrands.com/" target="_blank"><img src="https://d1bud3tr8474k6.cloudfront.net/wp-content/uploads/2017/09/17194616/fhi-logo2.jpg" className="img img-fluid" /></Link></div>
              <div className="sponsor"><Link to="https://completelybare.com/" target="_blank"><img src="https://d1bud3tr8474k6.cloudfront.net/wp-content/uploads/2017/09/17194614/completelybare-logo1.jpg" className="img img-fluid" /></Link></div>
              <div className="sponsor"><Link to="http://bronxcolors.com/" target="_blank"><img src="https://amer-bstar-prod-s3-assets-zngq8vlxtpl7.s3-us-west-2.amazonaws.com/wp-content/uploads/2017/09/26152415/bronx-logo3.jpg" className="img img-fluid" /></Link></div>
            </div>
            <div className="footerSponsors">
              <div className="sponsor"><Link to="https://www.algenist.com/americanbeautystar" target="_blank"><img src="https://d1bud3tr8474k6.cloudfront.net/wp-content/uploads/2017/09/17194611/algenist-logo2.jpg" className="img img-fluid" /></Link></div>
              <div className="sponsor"><Link to="https://www.ae.com/" target="_blank"><img src="https://d1bud3tr8474k6.cloudfront.net/wp-content/uploads/2017/09/17200723/american-eagle-logo.jpg" className="img img-fluid" /></Link></div>
              <div className="sponsor"><Link to="http://www.ardelllashes.com/" target="_blank"><img src="https://d1bud3tr8474k6.cloudfront.net/wp-content/uploads/2017/09/17200724/ardell-logo.jpg" className="img img-fluid" /></Link></div>
              <div className="sponsor"><Link to="http://www.christopherguy.com/" target="_blank"><img src="https://d1bud3tr8474k6.cloudfront.net/wp-content/uploads/2017/09/17200726/cg-logo.jpg" className="img img-fluid" /></Link></div>
              <div className="sponsor"><Link to="http://www.extensionbarla.com/" target="_blank"><img src="https://amer-bstar-prod-s3-assets-zngq8vlxtpl7.s3-us-west-2.amazonaws.com/wp-content/uploads/2017/10/05181409/extensionbar-logo1.jpg" className="img img-fluid" /></Link></div>
              <div className="sponsor"><Link to="http://jtv.com/" target="_blank"><img src="https://api.americanbeautystar.com/wp-content/uploads/2017/09/jtv-logo-2.jpg" className="img img-fluid" /></Link></div>
              <div className="sponsor"><Link to="http://shehairusa.co/" target="_blank"><img src="https://d1bud3tr8474k6.cloudfront.net/wp-content/uploads/2017/09/17200728/shewigs-logo.jpg" className="img img-fluid" /></Link></div>
              <div className="sponsor"><Link to="http://www.perfectcorp.com/" target="_blank"><img src="https://api.americanbeautystar.com/wp-content/uploads/2017/09/youcam-logo.jpg" className="img img-fluid" /></Link></div>

            </div>
          </div>
      </div>
    );
  }
}
