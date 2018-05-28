import React from 'react';
import { PropTypes } from 'prop-types';

import FacebookIcon from 'material-ui-community-icons/icons/facebook';
import TwitterIcon from 'material-ui-community-icons/icons/twitter';
import GooglePlusIcon from 'material-ui-community-icons/icons/google-plus';
import TumblrIcon from 'material-ui-community-icons/icons/tumblr';
import PinterestIcon from 'material-ui-community-icons/icons/pinterest';

export default class Share extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    poster: PropTypes.string.isRequired,
    description: PropTypes.string
  };
  constructor(props) {
    super(props);
  }

  windowPopUp(provider, width = 600, height = 650) {
    const title = encodeURIComponent(this.props.title);
    const description = this.props.description ? encodeURIComponent(this.props.description) : "";
    const poster = encodeURIComponent(this.props.poster);
    const pageUrl = encodeURIComponent(window.location.href);
    let shareUrl = "";

    switch (provider) {
      case "facebook":
        shareUrl = "//www.facebook.com/sharer/sharer.php?u=" + pageUrl + "&title=" + title + "&description=" + description;
        break;
      case "twitter":
        shareUrl = "//twitter.com/intent/tweet?original_referer=https%3A%2F%2Fabout.twitter.com%2Fresources%2Fbuttons&text=" + title + "&tw_p=tweetbutton&url=" + pageUrl;
        break;
      case "googleplus":
        shareUrl = "//plus.google.com/share?url=" + pageUrl;
        break;
      case "tumblr":
        shareUrl = "//www.tumblr.com/share?v=3&u=" + pageUrl + "&t=" + title;
        break;
      case "pinterest":
        shareUrl = "//pinterest.com/pin/create/button/?url=" + pageUrl + "&poster=" + poster + "&description=" + title + "&is_video=true";
        break;
      default:
        return;
    }

    // Calculate the position of the popup so
    // it’s centered on the screen.
    const left = (screen.width / 2) - (width / 2);
    const top = (screen.height / 2) - (height / 2);
    window.open(
      shareUrl,
      "_new",
      "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=" + width + ",height=" + height + ",top=" + top + ",left=" + left
    );
  }

  render() {
    const ShareStyles = require('./Share.less');

    const iconStyles = {
      color: "#a5a5a5",
    };

    return (
      <div className="socialIcons">
        <div className="socialIcon"><FacebookIcon style={iconStyles} className="facebook" onClick={() => { this.windowPopUp("facebook");}}/></div>
        <div className="socialIcon"><TwitterIcon style={iconStyles} className="twitter" onClick={() => { this.windowPopUp("twitter");}}/></div>
        <div className="socialIcon"><GooglePlusIcon style={iconStyles} className="googleplus" onClick={() => { this.windowPopUp("googleplus");}}/></div>
        <div className="socialIcon"><TumblrIcon style={iconStyles} className="tumblr" onClick={() => { this.windowPopUp("tumblr");}}/></div>
        <div className="socialIcon"><PinterestIcon style={iconStyles} className="pinterest" onClick={() => { this.windowPopUp("pinterest");}} /></div>
      </div>
    );
  }
}
