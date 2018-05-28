import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import 'babel-polyfill';
import { Link } from 'react-router';
import { loadPlaylist as loadPlaylistBySlug } from 'redux/modules/watch';
import PlaceHolder from '../../components/DynamicPlaceHolder/DynamicPlaceHolder';
// connect so we can use dispatch actions and listen for playlist events
@connect(state => ({
    token: state.apiAccess.token,
    loadingPlaylistData: state.watch.loading_playlists,
    loadedPlaylistData: state.watch.loaded_playlists,
    railPlaylists: state.watch
  }), { loadPlaylistBySlug }
)

export default class WatchList extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    content: PropTypes.object.isRequired,
    slug: PropTypes.string.isRequired,
    channel_slug: PropTypes.string,
    loadPlaylistBySlug: PropTypes.func.isRequired,
    loadingPlaylistData: PropTypes.bool,
    loadedPlaylistData: PropTypes.bool,
    loaded: PropTypes.bool,
    error: PropTypes.object,
    name: PropTypes.string,
    location: PropTypes.string,
    videoId: PropTypes.string,
    railPlaylists: PropTypes.object,
    height: PropTypes.string
  };

  componentDidMount() {
  }

  componentWillReceiveProps() {
    const { content, slug, loadingPlaylistData } = this.props;
    if (content) {
      const needsPlaylist = (typeof content.channels !== 'undefined' && content.channels[0]._id !== "0" && content.channels.length === 1);
      if (needsPlaylist && !loadingPlaylistData) this.requestPlaylistData();
    }
  }


  requestPlaylistData() {
    const { content, token, slug, loadingPlaylistData } = this.props;
    if (content) {
      if (!loadingPlaylistData && content.channels.length === 1 && content.channels[0]._id !== "0") {
        this.props.loadPlaylistBySlug(token, slug);
      }
    }
  }

  watchListItem(id, idx, poster, url, title, isSingleChannel, seriesTitle, videoId, shortDesc) {
      let thePosterImg = (poster !== '') ? <img src={poster} className="img img-fluid" /> : <PlaceHolder size="160x90" />;
      return (
        <li><Link to={url}>
          <div className="watchlist-item-poster">{thePosterImg}</div>
          <div className="watchlist-item-text">
            <div className="watchlist-item-title">{title}</div>
            <div className="watchlist-short-desc">{this.charLimit(shortDesc, 120)}</div>
          </div>
        </Link>
        </li>
      );
  }

  charLimit(val, limit) {
    let strVal = val;
    let theLimit = limit - 3;
    if (strVal.length >= theLimit) {
      strVal = strVal.substring(0, theLimit) + '...';
    }
    return (strVal);
  }

  render() {
    const IVPRailStyles = require("./WatchList.less");
    if (typeof window === 'undefined') {
      return <div/>;
    }

    const { name, content, loadingPlaylistData, loadedPlaylistData, videoId, railPlaylists, slug } = this.props;

    let categoryUrl = '';
    let ListItems = [];
    let channelSlug = "";
    // these are regular rails (ie one built from DSP channel data)
    if (content && Object.keys(content).length > 0) {
      let myChannels = content;

      if (typeof content.channels === 'undefined' && typeof this.props.content.playlist !== 'undefined') {
        myChannels = Object.assign(content, { channels: this.props.content.playlist });
      } else if (typeof railPlaylists[slug] !== 'undefined' && content.channels[0]._id !== "0") {
        myChannels = Object.assign(content, { channels: railPlaylists[slug].results });
      }

      // iterate over contents making a single slide/card out of each one
      if (myChannels && myChannels.channels && myChannels.channels.length > 0) {
        myChannels.channels.map((channel, index) => {
          // channels containing video content need some property overrides
          // since playlist data structure is different from channel data structure
          let url = channel.videoUrl ? channel.videoUrl : "/watch/" + channel.slug;
          const isSingleChannel = channel.categories || channel.childchannels ? false : true;
          if (isSingleChannel) {
            channelSlug = "/watch/" + channel.channel_slug;
          }
          const seriesTitle = channel.seriesTitle ? channel.seriesTitle : null;
          const shortDesc = channel.description && channel.description.length > 0 ? channel.description : "No Description Available";

          let poster = '';
          if (typeof channel.spotlight_poster !== 'undefined') {
            poster = channel.spotlight_poster + '/300/170';
          } else if (typeof channel.thumb !== 'undefined') {
            if (channel.thumb.indexOf('thumb_1.jpg') > -1) {
              poster = "//image.dotstudiopro.com/" + channel.thumbs[0] + '/300/170';
            } else {
              poster = "//image.dotstudiopro.com/" + channel.thumb + '/300/170';
            }
          }
          if (isSingleChannel && !channel.videoUrl && this.props.location) {
            // IVP-related; get the current path and append video id for links, ensuring we don't append twice
            url = this.props.location + "/" + channel._id;
          }

          categoryUrl = channelSlug.length > 0 ? channelSlug : "/" + this.props.slug;
          ListItems.push(
            this.watchListItem(channel._id, index, poster, url, channel.title, isSingleChannel, seriesTitle, videoId, shortDesc)
          );
        });
      } else {
        for (let i = 0; i <= 4; i++) {
          this.watchListItem(null, i);
        }
      }
    }


    return (
      <div className="ivp-watch-list">
        <div className="ivp-list">
          <h2 className="ivp-list-title">{content.category ? content.category.name : ""}</h2>
          <ul>
            {ListItems}
          </ul>
        </div>
      </div>
    );
  }
}
