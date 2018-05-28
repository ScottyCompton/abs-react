import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router';
import PlaceHolder from '../../components/DynamicPlaceHolder/DynamicPlaceHolder';

export default class RailSlide extends Component {
  static propTypes = {
    url: PropTypes.string,
    title: PropTypes.string,
    seriesTitle: PropTypes.string,
    poster: PropTypes.string,
    slideId: PropTypes.string,
    isSingleChannel: PropTypes.bool,
    selected: PropTypes.bool,
    slideHover: PropTypes.bool,
    shortDesc: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      slideHover: false,
      btnHover: false,
    };
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
  }

  charLimit(val, limit) {
    let strVal = val;
    let theLimit = limit - 3;
    if (strVal.length >= theLimit) {
      strVal = strVal.substring(0, theLimit) + '...';
    }
    return (strVal);
  }

  handleMouseOver() {
    // do something
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
      // do something
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
    const { url, seriesTitle, title, isSingleChannel, selected, slideId, shortDesc } = this.props;
    let metaSeriesTitle = [];
    let metaTitle = [];
    let metaInfoClassName = [];

    if (seriesTitle || isSingleChannel) {
      metaInfoClassName.push('metaInfo');
      metaTitle.push(<h4 key="0" className="metaTitle">{this.charLimit(title, 40)}</h4>);
      if (seriesTitle) metaSeriesTitle.push(<h4 key="0" className="metaSeriesTitle">{seriesTitle}</h4>);
    }

    return (
      <div className={"railItem " + (selected ? "selected" : "")} onMouseOver={() => this.handleMouseOver()} onMouseOut={() => this.handleMouseOut()}>
        <Link to={url} onClick={this.PlayButtonClick}>
          {this.props.poster === "" || this.props.poster === undefined ? <PlaceHolder size="160x90" /> : <img src={this.props.poster} className="img img-fluid" />}
          {isSingleChannel && (<div className={this.state.slideHover ? "metaInfo slideHoverOn" : "metaInfo slideHoverOff"}>
            {metaTitle}
            {metaSeriesTitle}
            <div className={this.state.btnHover ? "metaPlayBtn btnHover" : "metaPlayBtn btnOff"} onMouseOver={() => this.handleBtnMouseOver()} onMouseOut={() => this.handleBtnMouseOut()}><img src="https://d1bud3tr8474k6.cloudfront.net/wp-content/uploads/2017/09/13175358/playbtn-pink.png" className="img img-fluid" /></div>
            <div><h4 className="metaShortDesc">{shortDesc}</h4></div>
          </div>)}
        </Link>
      </div>
    );
  }

}
