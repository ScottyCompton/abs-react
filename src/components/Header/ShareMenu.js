import React from 'react';
import { PropTypes } from 'prop-types';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import Share from 'material-ui/svg-icons/social/share';
import FlatButton from 'material-ui/FlatButton';
import FacebookIcon from 'material-ui-community-icons/icons/facebook';
import TwitterIcon from 'material-ui-community-icons/icons/twitter';
import GooglePlusIcon from 'material-ui-community-icons/icons/google-plus';
import TumblrIcon from 'material-ui-community-icons/icons/tumblr';
import PinterestIcon from 'material-ui-community-icons/icons/pinterest';

export default class ShareMenu extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    poster: PropTypes.string,
    description: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
      dialogUrl: ""
    };
  }

  windowPopUp(provider, width = 500, height = 300) {
    // let title = encodeURIComponent(this.props.title);
    const title = this.props.title ? encodeURIComponent(this.props.title) : encodeURIComponent("American Beauty Stars");
    const description = this.props.description ? encodeURIComponent(this.props.description) : encodeURIComponent(document.title);
    const poster = this.props.poster ? encodeURIComponent(this.props.poster) : encodeURIComponent("https://d1bud3tr8474k6.cloudfront.net/wp-content/uploads/2017/08/18162731/ABSLogoFinalHiRes.png");
    let pageUrl = encodeURIComponent(window.location.href);
    let shareUrl = "";

    switch (provider) {
      case "facebook":
        shareUrl = "http://www.facebook.com/sharer/sharer.php?u=" + pageUrl + "&title=" + title + "&description=" + description;
        break;
      case "twitter":
        shareUrl = "http://twitter.com/intent/tweet?original_referer=https%3A%2F%2Fabout.twitter.com%2Fresources%2Fbuttons&text=" + title + "&tw_p=tweetbutton&url=" + pageUrl;
        break;
      case "googleplus":
        shareUrl = "http://plus.google.com/share?url=" + pageUrl;
        break;
      case "tumblr":
        shareUrl = "http://www.tumblr.com/share?v=3&u=" + pageUrl + "&t=" + title;
        break;
      case "pinterest":
        shareUrl = "http://pinterest.com/pin/create/button/?url=" + pageUrl + "&poster=" + poster + "&description=" + title + "&is_video=true";
        break;
      default:
        return;
    }

    // Calculate the position of the popup so
    // it’s centered on the screen.
    const left = (screen.width-width)/2;
    const top = (screen.height-height)/2;

    window.open(
      shareUrl,
      "_new",
      "menubar=no,location=no,,status=no,toolbar=no,resizable=yes,scrollbars=yes,width=" + width + ",height=" + height + ",top=" + top + ",left=" + left
    );
    /*
    this.setState(
      {
        dialogOpen: true,
        dialogUrl: shareUrl,
      }
    );
    */
  }

  handleClose = () => {
    this.setState({dialogOpen: false});
  };


  render() {
    const styles = require("./share-menu.less");
    const shareStyle = {
      style: {
        width: "9vw",
        height: "9vw",
        padding: "0px",
      },
      iconStyle: {
        width: "9vw",
        height: "9vw",
        padding: "0px;"
      }
    };
    const t = true;
    const actions = [
      <FlatButton
        label="Cancel"
        primary={t}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={t}
        disabled={t}
        onClick={this.handleClose}
      />,
    ];
    return (
      <span>
        {/*
        <Dialog
          title="Dialog With Actions"
          actions={actions}
          modal={t}
          open={this.state.dialogOpen}
        >
          {this.state.dialogOpen && <iframe src={this.state.dialogUrl} className="share-iframe" width="100%" height="100%" scrollbars="no" />}
        </Dialog>
        */}
      <div className="shareMenu">
        <IconMenu
          style={shareStyle.style}
          iconStyle={shareStyle.iconStyle}
          iconButtonElement={<IconButton tooltip="Share" style={shareStyle.style} iconStyle={shareStyle.iconStyle}><Share/></IconButton>}
          anchorOrigin={{ horizontal: 'middle', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'middle', vertical: 'bottom' }}
          maxHeight={400}
          onItemTouchTap={(event, child) => this.windowPopUp(child.props.className)}
        >

          {/* <span>Share</span> */}

          <MenuItem className="facebook">
            <IconButton>
              <FacebookIcon/>
            </IconButton>
          </MenuItem>
          <MenuItem className="twitter">
            <IconButton>
              <TwitterIcon/>
            </IconButton>
          </MenuItem>
          <MenuItem className="googleplus">
            <IconButton>
              <GooglePlusIcon/>
            </IconButton>
          </MenuItem>
          <MenuItem className="tumblr">
            <IconButton>
              <TumblrIcon/>
            </IconButton>
          </MenuItem>
          <MenuItem className="pinterest">
            <IconButton>
              <PinterestIcon/>
            </IconButton>
          </MenuItem>
          <p></p>
        </IconMenu>
      </div>
    </span>
    );
  }
}
