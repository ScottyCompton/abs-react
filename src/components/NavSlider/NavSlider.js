import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Slider from 'react-slick'; // slick slider
import { load as loadFeaturedOptions } from 'redux/modules/featuredOptions';
import HeaderLink from '../Header/HeaderLink';


@connect(state => ({
  options: state.featuredOptions.options,
  loaded: state.featuredOptions.loaded,
  loading: state.featuredOptions.loading,
  error: state.featuredOptions.error,
}), { loadFeaturedOptions })

export default class NavSlider extends Component {
  static propTypes = {
    options: PropTypes.object,
    loadFeaturedOptions: PropTypes.func.isRequired,
    navItems: PropTypes.array,
    loading: PropTypes.bool,
    loaded: PropTypes.bool,
    error: PropTypes.object,
    location: PropTypes.object.isRequired,
  };


  constructor() {
    super();
    this.state = {
      smallScreen: false
    };
  }

  componentWillMount() {
    if (this.props.error || !this.props.loaded) {
      this.props.loadFeaturedOptions();
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize, {passive: true});
    window.addEventListener("load", this.handleResize, {passive: true});
    if (this.props.loaded) {
      const { options } = this.props;
    }
    this.forceUpdate();
  }

  componentWillUnmount() {
  }

  getSliderSettings(activeSlide) {
    return {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      arrows: false,
      swipe: true,
      swipeToSlide: true,
      draggable: true,
      centerMode: false,
      initialSlide: activeSlide,
      responsive: [{
        breakpoint: 1100,
        settings: {
          slidesToShow: 4
        }
      }, {
        breakpoint: 1025,
        settings: {
          slidesToShow: 4
        }
      }, {
        breakpoint: 700,
        settings: {
          slidesToShow: 4
        }
      }]
    };
  }

  isActiveSlide(theLinkUrl) {
    const {location} = this.props;
    let strLocation = location.pathname;
    if (strLocation.substring(0, 1) === '/') {
      strLocation = strLocation.substring(1, strLocation.length);
    }
    let aryLocation = strLocation.split('/');

    let strLinkUrl = theLinkUrl;
    if (strLinkUrl.substring(0, 1) === '/') {
      strLinkUrl = strLinkUrl.substring(1, strLinkUrl.length);
    }
    let aryLinkUrl = strLinkUrl.split('/');

    if (aryLinkUrl[aryLinkUrl.length-1] === "" && aryLinkUrl.length > -1) {
      aryLinkUrl.pop();
    }
    if (aryLinkUrl.length === 0) {
      aryLinkUrl.push("");
    }
    return aryLinkUrl[0] === aryLocation[0];
  }

  render() {
    const { loading, loaded, options, location } = this.props;
    if (!loading && loaded && options && options.menus && options.menus.header) {
      let navItems = options.menus.header;
      let activeSlide = 0;
      let pathName = location.pathname;
      let menuItems = [];
      if (navItems && navItems.length > 0) {
        for (let i = 0; i < navItems.length; i++) {
          menuItems.push(
            <div key={i+1} className="navItem">
              {/* <Link to={navItems[i].url}>{navItems[i].post_title}</Link> */}
              <HeaderLink linkTo={navItems[i].url} linkName={navItems[i].post_title} location={pathName}>{navItems[i].post_title}</HeaderLink>
            </div>
          );
          activeSlide = this.isActiveSlide(navItems[i].url) ? i+1 : 0;
        }
      }
      const settings = this.getSliderSettings(activeSlide);
      return (
        <div className="navSlider">
          <Slider {...settings}>
              {menuItems}
          </Slider>
        </div>
      );
    } else {
      return (
        <div></div>
      );
    }
  }

}
