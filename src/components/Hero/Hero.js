import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { load as loadHeroChannels } from 'redux/modules/hero';
import PlaceHolder from '../../components/DynamicPlaceHolder/DynamicPlaceHolder';
import HeroSlide from './HeroSlide';
import Slider from 'react-slick'; // slick slider
import RailPrevNextArrow from '../NoseyComponents/Rails/RailPrevNextArrow';

@connect(state => ({
    token: state.apiAccess.token,
    channels: state.hero.channels
  }), { loadHeroChannels }
)

export default class Hero extends Component {
  static propTypes = {
    loadHeroChannels: PropTypes.func.isRequired,
    token: PropTypes.string.isRequired,
    category: PropTypes.string,
    channels: PropTypes.array,
    progress: PropTypes.object,
    loaded: PropTypes.bool,
    error: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  componentDidMount() {
    const { category, token } = this.props;
    this.props.loadHeroChannels(category, token);
    this.showLoadedContent();
  }

  showLoadedContent() {
    setTimeout(function() {
      this.setState({
        loaded: true,
      });
    }.bind(this), 2000);
  }


  render() {
    const { channels, category } = this.props;
    const slickStyles = require('./slick.theme.less');
    let prevArrow = <RailPrevNextArrow whichArrow={'left'}/>;
    let nextArrow = <RailPrevNextArrow whichArrow={'right'}/>;

    // Iterate over channels making a single slide/card out of each one
    const Cards = [];
    if (channels && channels.length && channels[0] && channels[0].playlist) {
      channels[0].playlist.map((video) => {
        Cards.push(
          <div key={video._id}>
            <HeroSlide {...video} slug={channels[0].slug}/>
          </div>
        );
      });
    } else {
      Cards.push(<div key="0"></div>);
    }

    // Get config for slider
    const sliderSettings = {
      infinite: true,
      centerMode: true,
      autoplay: false,
      centerPadding: '2%',
      slidesToShow: 3,
      slidesToScroll: 1,
      prevArrow: prevArrow,
      nextArrow: nextArrow,
      speed: 1400,
      cssEase: 'cubic-bezier(0.700, 0.03, 0.515, 0.955)',
      autoplaySpeed: 4500,
      responsive: [
        {
          breakpoint: 1100,
          settings: {
            dots: false,
            centerMode: false,
            autoplay: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            prevArrow: prevArrow,
            nextArrow: nextArrow,
            speed: 1400,
            cssEase: 'cubic-bezier(0.700, 0.03, 0.515, 0.955)',
            autoplaySpeed: 4500,
          }
        },
        {
          breakpoint: 700,
          settings: {
            dots: false,
            arrows: false,
            centerMode: false,
            autoplay: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            speed: 1400,
            cssEase: 'cubic-bezier(0.700, 0.03, 0.515, 0.955)',
            autoplaySpeed: 4500,
          }
        },
      ]
    };

    // render method
    return (
      <div className={this.state.loaded ? "hero loaded" : "hero notloaded"}>
        <div className={this.state.loaded ? "slickContainer loaded" : "slickContainer notloaded"}>
          <Slider {...sliderSettings}>
            {Cards}
          </Slider>
        </div>
      </div>
    );
  }
}
