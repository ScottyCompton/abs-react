import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import PrevNextArrow from '../ShopSlider/ShopSliderPrevNextArrow';
import Slider from 'react-slick'; // slick slider
import PlaceHolder from '../../components/DynamicPlaceHolder/DynamicPlaceHolder';
import ReactGA from 'react-ga';

export default class ShopSlider extends Component {
  static propTypes = {
    content: PropTypes.array.isRequired,
    slug: PropTypes.string
  }

  linkGA(url, event) {
    const label = (this.props.slug || "STLClick") + "";
    // GOOGLE ANALYTICS
    ReactGA.event({
        category: 'ShopTheLook',
        action: 'Click',
        label: url,
        nonInteraction: true
    });
  }

  render() {
    const sliderStyles = require("./ShopSlider.less");
    let prevArrow = <PrevNextArrow whichArrow={'left'}/>;
    let nextArrow = <PrevNextArrow whichArrow={'right'}/>;

    const sliderSettings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      prevArrow: prevArrow,
      nextArrow: nextArrow,
      responsive: [{
        breakpoint: 600,
        settings: {
          slidesToShow: 1
        }
      }]
    };

    let carouselSlides = [];

    const { content} = this.props;

    content.map((slide, index) => {
      // const thumbURL = "https://image.dotstudiopro.com/" + slide.thumb + "/300/225";
      const thumbURL = slide.thumb;
      const url = slide.url;
      if (url !== "#" && url[0] !== "/" && url.indexOf('americanbeautystar.com') < 0) {
        carouselSlides.push(
          <a href={url} key={index} target={"_blank"} onClick={this.linkGA.bind(this, url)}>
            <div key={index} className="slideCard">
              <img src={thumbURL} className="img img-fluid"/>
            </div>
          </a>
        );
      } else {
        carouselSlides.push(
          <Link to={url} key={index} onClick={this.linkGA.bind(this)}>
            <div key={index} className="slideCard">
              {thumbURL !== "" ? <img src={thumbURL} className="img img-fluid"/> : <PlaceHolder size="200x200" />}
            </div>
          </Link>
        );
      }
    });

    return (
      <div className="shopRail">
        <Slider {...sliderSettings}>
          {carouselSlides}
        </Slider>
      </div>
    );
  }
}
