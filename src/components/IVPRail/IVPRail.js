import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import RailPrevNextArrow from '../NoseyComponents/Rails/RailPrevNextArrow';
import Slider from 'react-slick'; // slick slider

export default class IVPRail extends Component {
  static propTypes = {
    content: PropTypes.array.isRequired,
    slug: PropTypes.string.isRequired,
    channelSlug: PropTypes.string.isRequired,
    isParentChannel: PropTypes.bool.isRequired,
    name: PropTypes.string,
    slideCount: PropTypes.number,
  }

  constructor(props) {
    super(props);
    this.state = {
      smallScreen: false,
    };
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize, {passive: true});
    this.handleResize();
  }

  handleResize = (event) => {
    this.setState({
      smallScreen: window.innerWidth <= 800
    });
  }


  handleRailSlideMouseOver(ind) {
      let hoverStates = this.state ? this.state.slideHover : [];
      if (!hoverStates) hoverStates = [];
      hoverStates[ind] = true;
      this.setState({slideHover: hoverStates});
  }

  handleRailSlideMouseOut(ind) {
      let hoverStates = this.state ? this.state.slideHover : [];
      if (!hoverStates) hoverStates = [];
      hoverStates[ind] = false;
      this.setState({slideHover: hoverStates});
  }

  handleRailSlideBtnMouseOver(ind) {
      let hoverStates = this.state ? this.state.btnHover : [];
      if (!hoverStates) hoverStates = [];
      hoverStates[ind] = true;
      this.setState({btnHover: hoverStates});
  }

  handleRailSlideBtnMouseOut(ind) {
      let hoverStates = this.state ? this.state.btnHover : [];
      if (!hoverStates) hoverStates = [];
      hoverStates[ind] = false;
      this.setState({hover: hoverStates});
  }

  render() {
    const IVPRailStyles = require("./IVPRail.less");
    let prevArrow = <RailPrevNextArrow whichArrow={'left'}/>;
    let nextArrow = <RailPrevNextArrow whichArrow={'right'}/>;

    const sliderSettings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      arrows: true,
      prevArrow: prevArrow,
      nextArrow: nextArrow,
      responsive: [{
        breakpoint: 1375,
        settings: {
          slidesToShow: 4,
        }
      },
        {
          breakpoint: 1100,
          settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
        }
      },
    ]
    };

    let carouselSlides = [];

    const { content, slug, name, channelSlug } = this.props;

    content.map((video, index) => {
      let thumbURL = "https://image.dotstudiopro.com/" + video.thumb + "/320/180";
      if (video.thumb.indexOf('thumb_1.jpg') > -1 && video.thumbs && video.thumbs.length > 0) {
        thumbURL = "//image.dotstudiopro.com/" + video.thumbs[0] + "/320/180";
      }
      let url = "";
      if (channelSlug && this.props.isParentChannel) {
         url = "/watch/" + channelSlug + "/" + slug + "/video/" + video._id;
      } else {
         url = "/watch/" + slug + "/video/" + video._id;
      }

      const shortDesc = video.description && video.description.length > 0 ? video.description : "No Description Available";
      carouselSlides.push(
        <div key={video._id} className="carouselRailCard" onMouseOver={() => this.handleRailSlideMouseOver(index)} onMouseOut={() => this.handleRailSlideMouseOut(index)}>
          <Link to={url} key={index}>
            <div key={index} className="railCard">
              <img src={thumbURL} className="img img-fluid"/>
              <div className={this.state !== null && this.state.slideHover && this.state.slideHover[index] ? "metaInfo slideHoverOn" : "metaInfo slideHoverOff"}>
                <h4 className="metaTitle">{video.title}</h4>
                <h4 className="metaSeriesInfo">{video.seriestitle}</h4>
                <div className={this.state !== null && this.state.btnHover && this.state.btnHover[index] ? "metaPlayBtn btnHover" : "metaPlayBtn btnOff"} onMouseOver={() => this.handleRailSlideBtnMouseOver(index)} onMouseOut={() => this.handleRailSlideBtnMouseOut(index)}><img src="https://d1bud3tr8474k6.cloudfront.net/wp-content/uploads/2017/09/13175358/playbtn-pink.png" className="img img-fluid" /></div>
                <div><h4 className="metaShortDesc">{shortDesc}</h4></div>
              </div>
            </div>
          </Link>
        </div>
      );
    });

    const largeScreenContent = (
      <Slider {...sliderSettings}>
        {carouselSlides}
      </Slider>
    );

    const smallScreenContent = (
      <div className="smallScreenRail">
        {carouselSlides}
      </div>
    );

    const railContent = this.state.smallScreen ? smallScreenContent : largeScreenContent;

    return (
      <div className="ivpRail">
        {this.props.isParentChannel && <h1>{this.props.name}</h1>}
        {railContent}
      </div>
    );
  }
}
