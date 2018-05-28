import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import 'babel-polyfill';
import { Link } from 'react-router';
import { loadPlaylist as loadPlaylistBySlug } from 'redux/modules/watch';
import RailPrevNextArrow from '../NoseyComponents/Rails/RailPrevNextArrow';
import WatchRailSlide from './WatchRailSlide'; // individual element in the rail
import Slider from 'react-slick'; // slick slider

// connect so we can use dispatch actions and listen for playlist events
@connect(state => ({
    token: state.apiAccess.token,
    loadingPlaylistData: state.watch.loading_playlists,
    loadedPlaylistData: state.watch.loaded_playlists,
    railPlaylists: state.watch
  }), { loadPlaylistBySlug }
)

export default class WatchRail extends Component {
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

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    this.showLoadedContent();
  }

  componentWillReceiveProps() {
    const { content, slug, loadingPlaylistData } = this.props;
    if (content) {
      const needsPlaylist = (typeof content.channels !== 'undefined' && content.channels[0]._id !== "0" && content.channels.length === 1);
      if (needsPlaylist && !loadingPlaylistData) this.requestPlaylistData();
    }
  }

  getSliderSettings(slideCount) {
    let windowWidth = 1920;
    if (typeof window !== 'undefined') {
      windowWidth = window.innerWidth;
    }
    // The inifinite property on the slider must be set to false if we have less than 5 thumbs
    // otherwise it causes rendering issues
    const infinite = slideCount >= 5 ? true : false;
    let prevArrow = <div/>;
    let nextArrow = <div/>;
    if (windowWidth >= 1400 && slideCount > 5) {
      prevArrow = <RailPrevNextArrow whichArrow={'left'}/>;
      nextArrow = <RailPrevNextArrow whichArrow={'right'}/>;
    } else if (windowWidth >= 1100 && slideCount > 4) {
      prevArrow = <RailPrevNextArrow whichArrow={'left'}/>;
      nextArrow = <RailPrevNextArrow whichArrow={'right'}/>;
    } else if (windowWidth < 1100 && slideCount > 3) {
      prevArrow = <RailPrevNextArrow whichArrow={'left'}/>;
      nextArrow = <RailPrevNextArrow whichArrow={'right'}/>;
    }
    return {
      dots: false,
      infinite: infinite,
      speed: 1500,
      slidesToShow: 4,
      slidesToScroll: 4,
      prevArrow: prevArrow,
      nextArrow: nextArrow,
      responsive: [{
        breakpoint: 1400,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4
        }
      }, {
        breakpoint: 1100,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      }, {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      }]
    };
  }

  requestPlaylistData() {
    const { content, token, slug, loadingPlaylistData } = this.props;
    if (content) {
      if (!loadingPlaylistData && content.channels.length === 1 && content.channels[0]._id !== "0") {
        this.props.loadPlaylistBySlug(token, slug);
      }
    }
  }
  showLoadedContent() {
    setTimeout(function() {
      this.setState({
        loaded: true,
      });
    }.bind(this), 1500);
  }

  render() {
    if (typeof window === 'undefined') {
      return <div/>;
    }

    const { name, content, loadingPlaylistData, loadedPlaylistData, videoId, railPlaylists, slug } = this.props;

    let Cards = [];
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

          let poster = '';
          if (typeof channel.spotlight_poster !== 'undefined') {
            poster = channel.spotlight_poster + '/420/236';
          } else if (typeof channel.thumb !== 'undefined') {
            if (channel.thumb.indexOf('thumb_1.jpg') > -1) {
              poster = "//image.dotstudiopro.com/" + channel.thumbs[0] + '/420/236';
            } else {
              poster = "//image.dotstudiopro.com/" + channel.thumb + '/420/236';
            }
          }

          const shortDesc = channel.description && channel.description.length > 0 ? channel.description : "";
          Cards.push(
            <div id={channel._id} key={index}>
              <WatchRailSlide
                slideId={channel.id}
                poster={poster}
                url={url}
                title={channel.title}
                isSingleChannel={isSingleChannel}
                seriesTitle={seriesTitle}
                selected={videoId && videoId === channel._id || false}
                shortDesc={shortDesc}
              />
            </div>
          );
        });
      } else {
        for (let i = 0; i <= 4; i++) {
          Cards.push(<div key={i + 1}><WatchRailSlide /></div>);
        }
      }
    }

    // Get config for slider
    const settings = this.getSliderSettings(Cards.length);

    return (
      <div  className={this.state.loaded ? "theRail loaded" : "theRail notloaded"}>
        <div className="ivpRail">
          <h2 className="railTitle">{content.category ? content.category.name : ""}</h2>

          <Slider {...settings}>
            {Cards}
          </Slider>
        </div>
      </div>
    );
  }
}
