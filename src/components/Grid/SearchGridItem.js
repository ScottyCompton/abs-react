import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import ImageLoader from 'react-imageloader';
import PlaceHolder from '../../components/DynamicPlaceHolder/DynamicPlaceHolder';

export default class SearchGridItem extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    thumb: PropTypes.string.isRequired,
    resultType: PropTypes.string.isRequired,
    linkTo: PropTypes.string.isRequired,
    type: PropTypes.string,
    categoryName: PropTypes.string
  };

  componentWillMount() {
  }

  render() {
    const { id, title, thumb, categoryName, type, resultType } = this.props;

    let linkTo = "";
    let thumbImg = thumb !== null ? thumb : "http://d1bud3tr8474k6.cloudfront.net/wp-content/uploads/2017/07/17160507/abs-search-noimg.jpg";
    // videos and articles have quite different taxonomy, so decide which we have with resultType prop
    if (resultType === "video") {
      linkTo = "/video/" + id;
    } else {
      linkTo = this.props.linkTo;
    }
    return (
      <div className="searchGridItem">
        <div className="searchGridImgContainer">
          <PlaceHolder size="160x90" className="searchGridPlaceholder" />
          <Link to={linkTo}><div className="searchGridImg" style={{backgroundImage: 'url(' + thumbImg + ')'}}></div></Link>
        </div>
        <div className="itemTitle" >
            <Link to={linkTo}>{title}</Link>
        </div>
        <div className="itemCat" >
            { resultType !== "video" ? (categoryName || "Uncategorized") : "Video" }
        </div>
      </div>
    );
  }
}
