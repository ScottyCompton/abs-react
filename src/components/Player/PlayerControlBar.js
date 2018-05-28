import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import IconButton from 'material-ui/IconButton';
import SkipNext from 'material-ui/svg-icons/av/skip-next';
import SkipPrevious from 'material-ui/svg-icons/av/skip-previous';
import ShareMenu from './ShareMenu';
import More from 'material-ui/svg-icons/navigation/more-vert';
import Comment from 'material-ui/svg-icons/communication/comment';

@connect(state => ({
  videoObj: state.player.video,
  videoObjLoaded: state.player.loaded
}), { })

export default class PlayerControlBar extends React.Component {
  static propTypes = {
    locationObj: PropTypes.object.isRequired,
    currentUrl: PropTypes.string,
    nextVideo: PropTypes.string,
    previousVideo: PropTypes.string,
    videoObj: PropTypes.object,
    videoObjLoaded: PropTypes.bool,
  };

  static contextTypes = {
    router: React.PropTypes.object
  }

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      metaDivOpen: "drawer hide-me"
    };
  }

  componentWillMount() {
    this.forceUpdate();
  }

  componentWillReceiveProps(nextProps) {
    this.forceUpdate();
  }

  componentWillUnmount() {
    this.forceUpdate();
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  toggleMetaDrawer() {
    // console.log("Should toggle drawer. current state is: " + this.state.metaDivOpen);
    this.setState({
      'metaDivOpen': this.state.metaDivOpen === 'drawer show-me' ? 'drawer hide-me' : 'drawer show-me'
    });
  }

  formatRedirectUrls(url) {
    const loc = this.props.locationObj;
    const next = loc.pathname.split('/');
    next.splice(-1);
    const nextUrl = next.join('/') + '/' + url;
    return url;
  }

  render() {
    const styles = require('./player-control-bar.less');

    const { videoObjLoaded } = this.props;

    if (videoObjLoaded) {
      const { previousVideo, nextVideo, videoObj, currentUrl } = this.props;
      const { metaDivOpen } = this.state;

      // pick share image
      let shareImage = "";
      if (videoObj.socialImage) {
        shareImage = videoObj.socialImage;
      } else if (videoObj.spotlight_poster) {
        shareImage = videoObj.spotlight_poster;
      } else if (videoObj.thumb) {
        shareImage = videoObj.thumb;
      } else {
        shareImage = "https://d1bud3tr8474k6.cloudfront.net/wp-content/uploads/2017/08/08154416/Webp.net-resizeimage.png"; // TODO :: get default share image
      }

      return (
        <div key="dspPlayerControlBar" className="player-control-bar">
          <div className="controls-container">
            <div className="controls-prev">
              <Link className="video-previous" to={previousVideo && previousVideo.length > 0 ? this.formatRedirectUrls(previousVideo) : "" }>
                <IconButton tooltip="Previous">
                  <SkipPrevious/>
                </IconButton>
              </Link>
            </div>
            <div className="controls-meta">
              <h2>{videoObj ? videoObj.title : "Loading..."}</h2>
              <h3>{videoObj ? videoObj.seriestitle : "Loading..."}</h3>
            </div>
            <div className="controls-more">
              <IconButton tooltip="More" onClick={this.toggleMetaDrawer.bind(this)}>
                <More/>
              </IconButton>
            </div>
            <div className="controls-share">
                {videoObj && videoObj.title && (<ShareMenu
                  title={videoObj.title}
                  description={videoObj.description}
                  seriestitle={videoObj.seriestitle}
                  id={videoObj._id}
                  poster={shareImage}
                />)}
            </div>
            {videoObj && (<div className="controls-comment">
              <IconButton href="#comments" tooltip="Comment">
                <Comment/>
              </IconButton>
            </div>)}
            <div className="controls-next">
              <Link className="video-next" to={nextVideo && nextVideo.length > 0  ? this.formatRedirectUrls(nextVideo) : ""}>
                <IconButton tooltip="Next">
                  <SkipNext/>
                </IconButton>
              </Link>
            </div>
          </div>
          <div className="description-container">
            <div className={"description " + metaDivOpen}>
              <p style={{ 'paddingRight': '10px' }}>{videoObj ? videoObj.description : "Loading..."}</p>
            </div>
          </div>
        </div>

      );
    } else return null;
  }
}
