import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import config from '../../config';
import axios from 'axios';
import { load as loadInstagramPosts } from 'redux/modules/instagram';

import style from './InstagramCard.less';

@connect(state => ({
  images: state.instagram.images,
  loading: state.instagram.loading,
  loaded: state.instagram.loaded,
  error: state.instagram.error
}), { loadInstagramPosts })

export default class InstagramCard extends React.Component {
  static propTypes = {
    profile: PropTypes.string.isRequired,
    loadInstagramPosts: PropTypes.func.isRequired,
    images: PropTypes.array,
    loading: PropTypes.bool,
    loaded: PropTypes.bool,
    error: PropTypes.object
  }


  componentDidMount() {
    if (this.props.error || !this.props.loaded && !this.props.loading) {
      this.props.loadInstagramPosts(this.props.profile);
    }
  }


  render() {
    const { images } = this.props;
    let Images = [];

    if (images.length) {
      for (let i = 0; i < 8; i++) {
        try {
          Images.push(<div key={i} className="instagramItem"><Link target="_blank" to="https://instagram.com/americanbeautystar"><img src={images[i].thumbnail_src} className="img img-fluid"/></Link></div>);
        } catch (e) {
          // do nothing, it's fine if there are less than 8 images
        }
      }
    }

    return (
      <div className="instaCard">
        <h1>JOIN US ON INSTAGRAM</h1>
        <div className="instagramItems">
          { Images }
        </div>
      </div>
    );
  }
}
