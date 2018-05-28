import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import CarouselSlide from '../ScrollingCarousel/CarouselSlide';
import Slider from 'react-slick'; // slick slider
import PlaceHolder from '../../components/DynamicPlaceHolder/DynamicPlaceHolder';
import PrevNextArrow from '../../components/HomeFeaturedSlider/PrevNextArrow';

@connect(state => ({
  token: state.apiAccess.token,
}), { })

export default class ScrollingCarousel extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    slides: PropTypes.array,
    hover: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.state = {
      smallScreen: false
    };
  }

  componentDidMount() {
    window.addEventListener("load", this.handleResize, {passive: true});
    window.addEventListener("resize", this.handleResize, {passive: true});
    this.sliderContainer.addEventListener("mousewheel", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
    this.sliderContainer.removeEventListener("mousewheel", this.handleScroll);
  }

  // Use a class arrow function (ES7) for the handler. In ES6 you could bind()
  // a handler in the constructor.
  handleScroll = (event) => {
      event.preventDefault();
      if (event && event.deltaY && event.deltaY >= 0) {
        this.next();
      } else if (event && event.deltaY && event.deltaY < 0) {
        this.previous();
      } else {
        console.log("Something went wrong when I tried to listen for the mousewheel event. Perhaps you're using Firefox?");
      }
  };

  handleResize = (event) => {
    this.setState({
      smallScreen: window.innerWidth > 1100
    });
    this.forceUpdate();
  }

  next() {
      this.slider.slickNext();
  }
  previous() {
      this.slider.slickPrev();
  }

  render() {
    let sliderSettings = {};
    let prevArrow = <PrevNextArrow whichArrow={'left'}/>;
    let nextArrow = <PrevNextArrow whichArrow={'right'}/>;

    sliderSettings = {
      dots: false,
      infinite: true,
      prevArrow: prevArrow,
      nextArrow: nextArrow,
      speed: 500,
      slidesToShow: 4,
      className: 'scroll-carousel',
      arrows: true
    };

    let carouselSlides = [];

    if (this.props.slides && this.props.slides.length > 0) {
      const { slides } = this.props;
      for (let a=0; a<slides.length; a++) {
        carouselSlides.push(
          <div key={a} className="showCarouselItem">
            <CarouselSlide slideKey={a} slide={slides[a]} />
          </div>
        );
      }
    } else {
      carouselSlides.push(
        <div key={"1"} className="showCarouselItem">
          <PlaceHolder size="325x485" />
        </div>
      );
    }

    return (
      <div className="slider" ref={c => this.sliderContainer = c}>
        <Slider ref={c => this.slider = c } {...sliderSettings}>
          {carouselSlides}
        </Slider>
      </div>
    );
  }
}
