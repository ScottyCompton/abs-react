import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import PlaceHolder from '../../components/DynamicPlaceHolder/DynamicPlaceHolder';

@connect(state => ({
  token: state.apiAccess.token,
}), { })

export default class CarouselSlide extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    slide: PropTypes.object,
    hover: PropTypes.bool,
    slideKey: PropTypes.number,
  }

  constructor(props) {
    super(props);
    this.state = {
      hover: false
    };
  }

  handleSliderImgMouseOut() {
      this.setState({hover: false});
  }

  handleSliderImgHover() {
        this.setState({hover: true});
  }

  charLimit(val, limit) {
    let strVal = val;
    let theLimit = limit - 3;
    if (strVal.length >= theLimit) {
      strVal = strVal.substring(0, theLimit) + '...';
    }
    return (strVal);
  }


  formatDate(dte) {
    if (!dte) return "";
    let arrDteTime = dte.split(" ");
    let arrDate = arrDteTime[0].split("-");
    let m = arrDate[1].substring(0, 1) === "0" ? arrDate[1].substr(1, 1) : arrDate[1];
    let d = arrDate[2].substring(0, 1) === "0" ? arrDate[2].substr(1, 1) : arrDate[2];
    return (m + "/" + d + "/" + arrDate[0]);
  }


    render() {
      let theSlide = {};
      const {slide, slideKey} = this.props;
      theSlide.title = slide.blog_options ? slide.blog_options.title : "";
      theSlide.subhead = slide.post_title;
      theSlide.taxonomy = slide.taxonomy && slide.taxonomy[0] ? slide.taxonomy[0].slug : "uncategorized";
      theSlide.title_bg = slide.blog_options ? slide.blog_options.title_bg : "";
      theSlide.link = "/" + slide.post_type + "/" + theSlide.taxonomy + "/" + slide.post_name;
      theSlide.date = this.formatDate(slide.post_date);
      let image = 'https://s3-us-west-1.amazonaws.com/ambeautystars/homerailmock1.png';
      if (slide.thumb) {
      // Featured image
        image = slide.thumb;
      } else if (slide.meta && slide.meta.dspabs_headshot && slide.meta.dspabs_headshot[0].image) {
      // Headshot
        image = slide.meta.dspabs_headshot[0].image.url;
      }
      theSlide.image = image;

      const style = {
          backgroundColor: theSlide.title_bg || "#000000",
        };
      const dateParsed = new Date(theSlide.date);
      const linkTo = theSlide.link.replace("/tutorial/", "/tutorials/").replace("/article/", "/articles/").replace("/look/", "/looks/");
      const date = ( dateParsed.getMonth() + 1 )  + "/" + dateParsed.getDate() + "/" + dateParsed.getFullYear();


      return (
          <div className="showCarouselItemContainer">
          <Link to={linkTo}>
            <div className="showCarouselHead" style={style}>
              <div className="showCarouselTextContainer">
                <div className="showCarouselPostDate">{date}</div>
                <div className="showCarouselDesc">
                    <h3>{theSlide.title}</h3>
                    {/* <h4>{this.charLimit(theSlide.subhead, 42)}</h4> */}
                  </div>
              </div>
            </div>
            <div className={"showCarouselImgContainer " + (this.state !== null && this.state.hover ? "carouselSlideHover" : "carouselSlideOff")} style={{backgroundImage: "url(" + theSlide.image + ")"}}   onMouseOver={() => this.handleSliderImgHover()} onMouseOut={() => this.handleSliderImgMouseOut()}  ref="slideImg"></div>
            <PlaceHolder size="325x485" bgColor="#efefef" className="carouselPlaceHolder" />
          </Link>
          </div>
      );
    }
}
