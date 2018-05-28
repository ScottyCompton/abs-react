import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import IVPRail from '../../components/IVPRail/IVPRail';
import Player from '../../components/Player/Player';
import PlayerControlBar from '../../components/Player/PlayerControlBar';
import Comments from '../../components/Comments/Comments';
import config from '../../config';
import PlaceHolder from '../../components/DynamicPlaceHolder/DynamicPlaceHolder';

import { load as loadDSPChannelBySlug, cleanIVP } from 'redux/modules/ivp';

@connect(state => ({
  token: state.apiAccess.token,
  channel: state.ivp.channel,
  loading: state.ivp.loading,
  loaded: state.ivp.loaded,
  error: state.ivp.error,
  videoObj: state.player.video,
  videoObjLoaded: state.player.loaded
}), { loadDSPChannelBySlug, cleanIVP })

export default class IVP extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    loadDSPChannelBySlug: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    cleanIVP: PropTypes.func.isRequired,
    channel: PropTypes.object,
    error: PropTypes.object,
    loaded: PropTypes.bool,
    loading: PropTypes.bool,
    location: PropTypes.object,
    history: PropTypes.object,
    videoObj: PropTypes.object,
    videoObjLoaded: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      smallScreen: false
    };
  }

  componentDidMount() {
    // If this is a single video page (/video/:video), we don't need to load channels
    if (this.props.params.video && !this.props.params.category && !this.props.params.slug) {
      return;
    }
    const slug = this.props.params.slug === 'video' ? 'featured' : this.props.params.slug;
    this.props.loadDSPChannelBySlug(this.props.token, slug, (this.props.params.childSlug || ""));
    window.addEventListener("resize", this.handleResize, {passive: true});
    window.addEventListener("load", this.handleResize, {passive: true});
    this.handleResize();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.slug !== this.props.params.slug) {
      const slug = nextProps.params.slug === 'video' ? 'featured' : nextProps.params.slug;
      this.props.loadDSPChannelBySlug(this.props.token, slug, (this.props.params.childSlug || ""));
    }
    if (nextProps.params.video !== this.props.params.video) {
      this.forceUpdate();
    }
  }

  componentWillUnmount() {
    this.props.cleanIVP();
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("load", this.handleResize);
  }

  isBrowser() {
    return !(typeof document === "undefined" || typeof window === "undefined");
  }

  handleResize = (event) => {
    this.setState({
      smallScreen: window.innerWidth <= 1100
    });
  }

  render() {
    const { loading, loaded, videoObj } = this.props;
    // const railStyles = require('../../components/IVPRail/IVPRail.less');
    const shareURL = config.live.domain + this.props.location.pathname;

    let commentsContainer = null;
    if (shareURL && shareURL.length > 0 && loaded) {
      commentsContainer = (<Comments location={shareURL}/>);
    }
    const playerStyle = {
      width: '100%',
      position: 'relative',
      textAlign: 'center',
      float: 'left'
    };

    let playerControlBar = null;
    let ivpPlayerContainerStyle = {};
    if (this.state.smallScreen) {
      ivpPlayerContainerStyle = {
        width: "100%"
      };
    } else {
      ivpPlayerContainerStyle = {
        width: "65%",
        marginLeft: "17.5%"
      };
    }
    let playerContent = (
      <div className="player" style={playerStyle}>
        <PlaceHolder size="160x90" bgColor="#000000" />
      </div>
    );

    let metaBlock = (<div className="placeholderMeta"></div>);

    const RailContent = [];
    const Seasons = [];
    let videoId = "";
    let previousVideo = "";
    let nextVideo = "";

    const isParentChannel = this.props.channel._id !== "0" && this.props.channel.childchannels && this.props.channel.childchannels.length > 0;
    if (this.props.params.video) {
      videoId = this.props.params.video;
    } else if (loaded) {
      if (isParentChannel && this.props.channel) {
        videoId = this.props.channel.childchannels[0].playlist[0]._id;
      } else if (this.props.channel) {
        videoId = this.props.channel.playlist[0]._id;
      } else {
        videoId = 0;
      }
    }

    // once ajax is done lets re-render the placeholder items with actual contents
    if (!loading && loaded) {
      const { channel, token } = this.props;

      const { collapsePlayer } = this.state;
      const currentUrl = this.isBrowser() ? window.location.href : '';
      const parentPath = channel && channel.slug ? "/watch/" + channel.slug : "";

      // We check to see if there is only one channel that comes back, and if it has child channels.  If so, it's a parent.
      const mappableSeasons = isParentChannel ? channel.childchannels : [channel];

      let chans = mappableSeasons;

      // if (isParentChannel && channel) {
      //   videoId = channel.childchannels[0].playlist[0]._id;
      // } else if (channel) {
      //   videoId = channel.playlist[0]._id;
      // } else {
      //   videoId = 0;
      // }

      mappableSeasons.map((season, a) => {
        // If we are in a parent channel, we check each  child channel's playlist
        if (!mappableSeasons.playlist) chans = mappableSeasons[a];
        for (let b = 0; b < chans.playlist.length; b++) {
          // If the current video we are on matches the video in the iteration, we know we are on the ball.
          if (chans.playlist[b]._id === videoId) {
            // Default to assume we aren't at the end or beginning of a season
            previousVideo = chans.playlist[b - 1] ? parentPath + "/video/" + chans.playlist[b - 1]._id : "";
            nextVideo = chans.playlist[b + 1] ? parentPath + "/video/" + chans.playlist[b + 1]._id : "";
            // If we are at the end of a season, we check to see if there is another season
            if (!chans.playlist[b + 1] && mappableSeasons[a + 1] && isParentChannel) {
              nextVideo = mappableSeasons[a + 1].playlist[0] ? parentPath + "/video/" + mappableSeasons[a + 1].playlist[0]._id : "";
              previousVideo = chans.playlist[b - 1] ? parentPath + "/video/" + chans.playlist[b - 1]._id : "";
            } else if (!chans.playlist[b - 1] && mappableSeasons[a - 1] && isParentChannel) { // If we are at the beginning of the season, see if there are prior seasons
              nextVideo = chans.playlist[b + 1] ? parentPath + "/video/" + chans.playlist[b + 1]._id : "";
              previousVideo = mappableSeasons[a - 1].playlist[mappableSeasons[a - 1].playlist.length - 1] ? parentPath + "/video/" + mappableSeasons[a - 1].playlist[mappableSeasons[a - 1].playlist.length - 1]._id : "";
            }
          }
        }

        Seasons.push(<IVPRail key={a} name={season.title} slug={this.props.params.category || chans.slug}
           channelSlug={this.props.params.slug || ""} content={season.playlist}
           token={token} parentPath={parentPath} isParentChannel={isParentChannel} current={videoId}
           location={this.props.location.pathname} videoId={videoId}/>
        );
      });

      playerContent = (
        <Player
          video_id={videoId}
          nextVideo={nextVideo}
          historyObj={this.props.history}
          locationObj={this.props.location}
          yOffset = {160}
          innerWrapperWidth = "100%"
          options={{'loopplayback': false, 'playercontrolbar': false, 'autostart': true, 'noCollapse': this.state.smallScreen, autostartNext: true}}
        />
      );

        playerControlBar = (<PlayerControlBar previousVideo={previousVideo} nextVideo={nextVideo} locationObj={this.props.location} videoObj={videoObj} currentUrl={currentUrl}/>);

      metaBlock = !isParentChannel && (
        <div>
          <h1>{channel && channel.title ? channel.title.replace(" (Hero)", "") : ""}</h1>
        </div>
      );
    } else {
      if (this.props.params.video && this.props.route.videoType === 'single') {
        // We don't want the player loading before the channel is loaded
        // if we want it to automatically go to the next video
        playerContent = (<Player
          video_id={this.props.params.video}
          nextVideo={""}
          previousVideo={""}
          historyObj={this.props.history}
          locationObj={this.props.location}/>
        );
        playerControlBar = (
            <PlayerControlBar previousVideo={""} nextVideo={""} videoObj={videoObj} locationObj={this.props.location} currentUrl={""}/>
          );
      }
    }
    return (
      <div className="ivp" ref={c => this.ivpContainer = c}>
          {this.props.videoObjLoaded && <Helmet
            title={videoObj.title}
            meta={[
              { property: 'og:title', content: videoObj.title },
              { property: 'og:description', content: videoObj.description },
              { property: 'og:image', content: videoObj.thumb}
          ]}/>}
        <div className="ivpPlayerContainer" style={ivpPlayerContainerStyle}>
          { playerContent }
        </div>
        <div className="playerControlBarContainer">
          {playerControlBar}
        </div>

        <div className="metaBlock">
          { metaBlock }
        </div>

        <div className="rails">
          <div className="theRail">
            {loaded && Seasons.length > 0 && Seasons}
          </div>
        </div>


        <div className="comments-container row nopadding">
          <a name="comments">&nbsp;</a>
          <div className="col-md-12 nopadding">
            <div className="fb-comments-container">
              {commentsContainer}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
