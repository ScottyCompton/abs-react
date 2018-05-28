import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import { load as loadBlogFeaturedCarousel } from 'redux/modules/blogFeaturedCarousel';
import ScrollingCarousel from '../../components/ScrollingCarousel/ScrollingCarousel';
import CarouselSlide from '../../components/ScrollingCarousel/CarouselSlide';

@connect(state => ({
  token: state.apiAccess.token,
  slides: state.blogFeaturedCarousel.slides,
  slidesLoaded: state.blogFeaturedCarousel.loaded,
  slidesLoading: state.blogFeaturedCarousel.loading,
  slidesError: state.blogFeaturedCarousel.error,
  sections: state.blogFeaturedSections.sections,
  sectionsLoaded: state.blogFeaturedSections.loaded,
  sectionsLoading: state.blogFeaturedSections.loading,
  sectionsError: state.blogFeaturedSections.error
}), { loadBlogFeaturedCarousel })

export default class GetTheLook extends Component {
  static propTypes = {
    loadBlogFeaturedCarousel: PropTypes.func.isRequired,
    token: PropTypes.string.isRequired,
    slides: PropTypes.array,
    slidesLoaded: PropTypes.bool,
    slidesLoading: PropTypes.bool,
    slidesError: PropTypes.object,
    location: PropTypes.object
  }

  constructor() {
    super();
    this.state = {
      smallScreen: false,
    };
    this.largeScreenContent = this.largeScreenContent.bind(this);
    this.smallScreenContent = this.smallScreenContent.bind(this);
  }
  componentWillMount() {
    if (this.props.slidesError || !this.props.slidesLoaded) {
      this.props.loadBlogFeaturedCarousel();
    }
  }

  componentDidMount() {
    localStorage.setItem('locationBack', '/get-the-look');
    window.addEventListener("resize", this.handleResize, {passive: true});
    window.addEventListener("load", this.handleResize, {passive: true});
    this.handleResize();
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("load", this.handleResize);
  }

  handleResize = (event) => {
      this.setState({
        smallScreen: window.innerWidth <= 1100
      });
      this.forceUpdate();
  }

  smallScreenContent() {
    const {slides} = this.props;
    let carouselSlides = [];
    if (slides && slides.length > 0) {
      for (let i = 0; i < slides.length; i++) {
        carouselSlides.push(
          <div key={i} className="showCarouselItem">
            <CarouselSlide slideKey={i} slide={slides[i]} />
          </div>
        );
      }
      return (
        <div className="topCarouselSmallScreen">
          {carouselSlides}
        </div>
      );
    }
  }

  largeScreenContent() {
    return (
    <div className="topCarousel">
      <ScrollingCarousel slides={this.props.slides}/>
    </div>);
  }

  render() {
    return (
      <div className="look">
        <Helmet title="Get The Look"/>
        {!this.state.smallScreen && this.largeScreenContent()}
        {this.state.smallScreen && this.smallScreenContent()}
      </div>
    );
  }
}
