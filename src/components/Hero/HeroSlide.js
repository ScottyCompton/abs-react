import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import ImageLoader from 'react-imageloader';
import { RectShape, TextBlock } from 'react-placeholder/lib/placeholders';
import RaisedButton from 'material-ui/RaisedButton';
import ActionPlay from 'material-ui/svg-icons/av/play-circle-outline';
import Preloader from './HeroSlidePlaceholder';
import {Link} from 'react-router';
import PlaceHolder from '../../components/DynamicPlaceHolder/DynamicPlaceHolder';
const heroPreloadImg = require('../../../static/images/heroleftloader.jpg');
const heroTransImg = require('../../../static/images/300x168.png');

const styles = {
  button: {
    marginTop: 30,
    border: '1px solid #fff',
  },
};

export default class HeroSlide extends Component {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    thumb: PropTypes.string,
    slug: PropTypes.string,
    wallpaper: PropTypes.string,
    _id: PropTypes.string,
    preloadText: PropTypes.string,
    seriestitle: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      slideHover: false,
      btnHover: false,
    };
  }


  wordCount(strIn) {
    let aryWords = strIn.split(" ");
    let wordCount = 50;
    if (aryWords.length <= wordCount) {
      return strIn;
    }
    let aryOut = aryWords.splice(0, aryWords.length - wordCount);
    let strOut = aryOut.join(" ");
    return strOut;
  }


    handleMouseOver() {
      this.setState({
        slideHover: true
      });
    }

    handleMouseOut() {
      this.setState({
        slideHover: false
      });
    }

      handleBtnMouseOver() {
        this.setState({
          btnHover: true
        });
      }

      handleBtnMouseOut() {
        this.setState({
          btnHover: false
        });
      }

  render() {
    const { wallpaper } = this.props;
    const imageUrl = wallpaper ? "//image.dotstudiopro.com/" + wallpaper + "/150" : "";
    let aryWords = this.props.description ? this.props.description.split(" ") : "";
    let wordCount = 50;
    let strDesc = this.props.description;
    if (aryWords.length >= wordCount) {
      let aryOut = aryWords.splice(0, wordCount);
      strDesc = aryOut.join(" ") + '...';
    }

    return (
      <div onMouseOver={() => this.handleMouseOver()} onMouseOut={() => this.handleMouseOut()}>
        <article>
          <Link to={"watch/" + this.props.slug + "/video/" + this.props._id}>
          <div className="img-box">
            <img src="https://placehold.it/1200x600/ffffff/ffffff" className="placeHolder" />
            <div className="heroImage" style={{backgroundImage: "url(//image.dotstudiopro.com/" + this.props.thumb + "/856/485)"}}>
              <img src={"//image.dotstudiopro.com/" + this.props.thumb + "/600/338"} className="img img-fluid" />
              <div className={this.state.slideHover ? "slideHover slideHoverOn" : "slideHover slideHoverOff"}>
                <div className="playBtn">
                  <div className="playBtnImg"></div>
                  <div className="playBtnMsg">Watch Now</div>
                </div>
              </div>
            </div>
            <div className={this.state.slideHover ? "heroMeta slideHoverOn" : "heroMeta"}>
              <div className="heroMetaContainer">
                <h1 className="heroMetaTitle">{this.props.title}</h1>
                <div className="heroMetaText">{strDesc}</div>
              </div>
            </div>
          </div>
          </Link>
          {/*
          <div className="heroImage">
            <img src={"//image.dotstudiopro.com/" + this.props.thumb + "/856/482"} className="img img-fluid" />
          </div>
          <div className="heroMeta">
            <div className="heroMetaTitle"><h1>{this.props.title}</h1></div>
            <div className="heroMetaDesc"><h1>{strDesc}</h1></div>
            <div className={this.state.btnHover ? "metaPlayBtn btnHover" : "metaPlayBtn btnOff"} onMouseOver={() => this.handleBtnMouseOver()} onMouseOut={() => this.handleBtnMouseOut()}><img src="http://d1bud3tr8474k6.cloudfront.net/wp-content/uploads/2017/09/13175358/playbtn-pink.png" className="img img-fluid" /></div>
          </div>
          <Link to={"watch/video/" + this.props._id}>
          </Link>
          */}
        </article>
      </div>

    );
  }
}
