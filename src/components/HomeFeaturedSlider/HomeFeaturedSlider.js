import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { load as loadFeaturedOptions } from 'redux/modules/featuredOptions';
import { load as loadFeaturedCarousel } from 'redux/modules/featuredCarousel';
import PrevNextArrow from './PrevNextArrow';
import Slider from 'react-slick'; // slick slider
import PlaceHolder from '../../components/DynamicPlaceHolder/DynamicPlaceHolder';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // React Transitions API

@connect(state => ({
  options: state.featuredOptions.options,
  loaded: state.featuredOptions.loaded,
  loading: state.featuredOptions.loading,
  error: state.featuredOptions.error,
  slides: state.featuredCarousel.slides,
  slidesLoaded: state.featuredCarousel.loaded,
  slidesLoading: state.featuredCarousel.loading,
  slidesError: state.featuredCarousel.error
}), { loadFeaturedOptions, loadFeaturedCarousel })

export default class HomeFeaturedSlider extends Component {


  static propTypes = {
    loadFeaturedOptions: PropTypes.func.isRequired,
    loadFeaturedCarousel: PropTypes.func.isRequired,
    options: PropTypes.object,
    error: PropTypes.object,
    loaded: PropTypes.bool,
    slides: PropTypes.array,
    slidesLoaded: PropTypes.bool,
    slidesLoading: PropTypes.bool,
    slidesError: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object,
    hover: PropTypes.bool
  };

  constructor() {
    super();
    this.state = {
      smallScreen: false,
      hideMenu: false,
      loaded: false,
    };
  }

  componentWillMount() {
    if (this.props.error || !this.props.loaded) {
      this.props.loadFeaturedOptions();
    }
    if (this.props.slides || !slidesLoaded) {
      this.props.loadFeaturedCarousel();
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize, {passive: true});
    this.showLoadedContent();
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }


  getSliderSettings() {
    let prevArrow = <PrevNextArrow whichArrow={'left'}/>;
    let nextArrow = <PrevNextArrow whichArrow={'right'}/>;
    return {
      dots: false,
      infinite: true,
      speed: 5000,
      slidesToShow: 5,
      slidesToScroll: 5,
      autoplay: false,
      arrows: true,
      pauseOnHover: true,
      prevArrow: prevArrow,
      nextArrow: nextArrow,
      responsive: [{
        breakpoint: 1100,
        settings: {
          nextArrow: null,
          prevArrow: null,
          infinite: true,
          arrows: false,
          slidesToShow: this.props.slides.length,
          vertical: true
        },
      }]
    };
  }

  handleResize = (event) => {
      this.setState({
        smallScreen: window.innerWidth <= 1100
      });
  }

  handleSliderImgMouseOut(ind) {
      let hoverStates = this.state ? this.state.hover : [];
      if (!hoverStates) hoverStates = [];
      hoverStates[ind] = false;
      this.setState({hover: hoverStates});
  }

  handleSliderImgHover(ind) {
      let hoverStates = this.state ? this.state.hover : [];
      if (!hoverStates) hoverStates = [];
      hoverStates[ind] = true;
      this.setState({hover: hoverStates});
  }

  showLoadedContent() {
    setTimeout(function() {
      this.setState({
        loaded: true,
      });
    }.bind(this), 2000);
  }

  smallScreenContent() {
    const { options, slides } = this.props;
    const tiles = [];
    const slidesToShow = [];
    // make sure that there are no duplicate slides
    if (slides) {
      for (let a = 0; a <= slides.length-1; a++) {
        if (slidesToShow.join().indexOf(slides[a].post_title) === -1) {
          slidesToShow.push(slides[a]);
        }
      }
    }


    let loopCount = slidesToShow.length >= 8 ? 8 : slidesToShow.length;
    if (loopCount % 2 !== 0) {
      loopCount--;
    }
    for (let a = 0; a <= loopCount-1; a++) {
      let category = slidesToShow[a].taxonomy && slidesToShow[a].taxonomy[0] && slidesToShow[a].taxonomy[0].slug ? slidesToShow[a].taxonomy[0].slug : "uncategorized";
      let link = ("/" + slidesToShow[a].post_type + "/" + category + "/" + slidesToShow[a].post_name).replace("/tutorial/", "/tutorials/").replace("/article/", "/articles/").replace("/look/", "/looks/");
      let image = slidesToShow[a] && slidesToShow[a].featured_image && slidesToShow[a].featured_image.url ? slidesToShow[a].featured_image.url : 'https://s3-us-west-1.amazonaws.com/ambeautystars/homerailmock1.png';
      tiles.push(
        <div className="featuredTile">
          <Link to={link}>
          <div className="featuredTileImg" style={{backgroundImage: "url(" + image + ")"}}>
            <PlaceHolder size="325x485" />
            <div className="featuredTileTitle">{slidesToShow[a].post_title}</div>
            </div>
          </Link>
        </div>
      );
    }
    return (
      <div className="homeFeaturedTiles">
        <div className="featuredLabel"><h1>Featured Articles & Tutorials</h1></div>
        <div className="featuredTiles">
            {tiles}
        </div>
      </div>
    );
  }

  largeScreenContent() {
    const { options, slides } = this.props;
    const settings = this.getSliderSettings(4);
    const carouselSlides = [];
    const carouselTitles = [];
    const slidesToShow = [];
    // make sure that there are no duplicate slides
    if (slides) {
      for (let a = 0; a <= slides.length-1; a++) {
        if (slidesToShow.join().indexOf(slides[a].post_title) === -1) {
          slidesToShow.push(slides[a]);
        }
      }
    }

    const loopCount = slidesToShow.length;
    if (slidesToShow && loopCount > 0) {
      for (let a=0; a < loopCount; a++) {
        let image = slidesToShow[a] && slidesToShow[a].featured_image && slidesToShow[a].featured_image.url ? slidesToShow[a].featured_image.url : 'https://s3-us-west-1.amazonaws.com/ambeautystars/homerailmock1.png';
        let category = slidesToShow[a].taxonomy && slidesToShow[a].taxonomy[0] && slidesToShow[a].taxonomy[0].slug ? slidesToShow[a].taxonomy[0].slug : "uncategorized";
        let link = ("/" + slidesToShow[a].post_type + "/" + category + "/" + slidesToShow[a].post_name).replace("/tutorial/", "/tutorials/").replace("/article/", "/articles/").replace("/look/", "/looks/");
        let placeHolderImg = <img src={image} className="carouselPlaceHolder img img-fluid" />;
        const seymourBtn = (
          <div className={'seymourBtn ' + (this.state !== null && this.state.hover && this.state.hover[a] ? 'homeSlideHover' : 'homeSlideOff')}>
            <Link to={link}   onMouseOver={() => this.handleSliderImgHover(a)} onMouseOut={() => this.handleSliderImgMouseOut(a)}><img src="https://d1bud3tr8474k6.cloudfront.net/wp-content/uploads/2017/08/14212009/seymour.png" className="img img-fluid" /></Link>
          </div>
        );
          carouselSlides.push(
            <div key={a} className="placeHolderFeaturedContainer">
              <div className={'placeholderFeaturedItem ' + (this.state !== null && this.state.hover && this.state.hover[a] ? 'homeSlideHover' : 'homeSlideOff')} style={{backgroundImage: 'url(' + image + ')'}}  onMouseOver={() => this.handleSliderImgHover(a)} onMouseOut={() => this.handleSliderImgMouseOut(a)}  ref="slideImg">
                <Link className="carouselSlideItem" to={link}>
                    {placeHolderImg}
                </Link>
                {/* <div className="featuredText"><h1><Link to={link}   onMouseOver={() => this.handleSliderImgHover(a)} onMouseOut={() => this.handleSliderImgMouseOut(a)}>{slidesToShow[a].post_title}</Link></h1></div> */}
              </div>
              {seymourBtn}
            </div>
            );
            carouselTitles.push(slidesToShow[a].post_title);
        }
    } else {
      carouselSlides.push(
        <div key={0} className="placeHolderFeaturedContainer">
          <div className="placeholderFeaturedItem">
            <PlaceHolder size="325x485" />
          </div>
        </div>
        );
    }
    return (
      <div className={this.state.loaded ? "homeFeaturedSlider loaded" : "homeFeaturedSlider notloaded" }>
        <div className="featuredLabel"><h1>Featured Articles & Tutorials</h1></div>
        <div className="featuredContainer">
          <Slider {...settings}>
            {carouselSlides}
          </Slider>
        </div>
      </div>
    );
  }

  render() {
    const styles = require('./HomeFeaturedSlider.less');
    return (
      this.state.smallScreen ? this.smallScreenContent() : this.largeScreenContent()
    );
  }
}
