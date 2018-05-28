import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { browserHistory } from 'react-router';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import 'babel-polyfill';
import { FormattedMessage } from 'react-intl';
import AppBar from 'material-ui/AppBar';
import theme from 'theme/theme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import FacebookIcon from 'material-ui-community-icons/icons/facebook-box';
import TwitterIcon from 'material-ui-community-icons/icons/twitter-box';
import InstagramIcon from 'material-ui-community-icons/icons/instagram';
import PinterestIcon from 'material-ui-community-icons/icons/pinterest';
import HeaderLink from '../Header/HeaderLink';
import Ad from '../Ad/Ad';
import { load as loadFeaturedOptions } from 'redux/modules/featuredOptions';
import PlaceHolder from '../../components/DynamicPlaceHolder/DynamicPlaceHolder';
import SearchIcon from 'material-ui/svg-icons/action/search';

@connect(state => ({
  options: state.featuredOptions.options,
  loaded: state.featuredOptions.loaded,
  loading: state.featuredOptions.loading,
  error: state.featuredOptions.error
}), { loadFeaturedOptions })

export default class LargeScreenHeader extends Component {
  static propTypes = {
    loadFeaturedOptions: PropTypes.func.isRequired,
    options: PropTypes.object,
    loading: PropTypes.bool,
    loaded: PropTypes.bool,
    error: PropTypes.object,
    location: PropTypes.object.isRequired,
    showHeader: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
    };
  }

  componentDidMount() {
    this.showLoadedContent();
  }

  showLoadedContent() {
    setTimeout(function() {
      this.setState({
        isLoaded: true,
      });
    }.bind(this), 1000);
  }


  render() {
    let adDiv = "";
    const { location, options, showHeader } = this.props;
    let pathName = location.pathname + "";
    let menus = {};
    let Ads = [];
    let headerDisplayClass = showHeader ? "visibleBigHeader" : "hiddenBigHeader";
    let spacerDisplayClass = showHeader ? "big-ol-spacer" : "hiddenSpacer";
    let theAdImg = options && options.ad && options.ad.image && options.ad.image.url ? <img src={options.ad.image.url} className="img img-fluid" /> : <PlaceHolder size="592x144" />;
    let adImgLink = options && options.ad && options.ad.link ? options.ad.link : "#";

      if (options.menus) {
        let header = options.menus.header;
        menus.header = header.map((item, ind) => {
          let type = item.entry_type;

          if (type === 'custom') {
            return <li key={ind}><HeaderLink linkTo={item.url} linkName={item.post_title} location={pathName}>{item.post_title}</HeaderLink></li>;
          } else if (type === 'post_type_archive') {
            let url = ['host', 'judge', 'contestant'].indexOf(item.post_type) > -1 ? "/show/" + item.post_type : "/" + item.post_type + "s";
            return <li key={ind}><HeaderLink linkTo={url} linkName={item.post_title} location={pathName}>{item.post_title}</HeaderLink></li>;
          } else {
            let url = ['host', 'judge', 'contestant'].indexOf(item.post_type) > -1 ? "/show/" + item.post_type + "/" + item.post_name : "/" + item.post_type + "s/" + item.post_name;
            return <li key={ind}><HeaderLink linkTo={url} linkName={item.post_title} location={pathName}>{item.post_title}</HeaderLink></li>;
          }
        });
      }
    return (
      this.state.isLoaded &&
      <span>
        <div className={"largeScreenHeader " + headerDisplayClass}  ref={c => this.container = c}>
          <AppBar className="nav" iconStyleLeft={{display: "none"}}>
            <div className="headerLeft">
              <div className="headerBranding">
                <Link to="/">
                  <img src="https://ambeautystars.s3-us-west-1.amazonaws.com/wp-content/uploads/2017/09/15152225/ltabslogo2.png" />
                </Link>
              </div>
            </div>
            <div className="headerRight">
              <div className="navItems">
                <ul>
                  {menus.header}
                </ul>
              </div>
              <div className="navSocialIcons">
                <div className="socialIcon"><Link to="https://www.facebook.com/American-Beauty-Star-1869648053297997/" target="_blank"><FacebookIcon className="headerIcon" /></Link></div>
                <div className="socialIcon"><Link to="https://twitter.com/AmBeautyStar" target="_blank"><TwitterIcon className="headerIcon" /></Link></div>
                <div className="socialIcon"><Link to="https://www.instagram.com/americanbeautystar/" target="_blank"><InstagramIcon className="headerIcon" /></Link></div>
                <div className="socialIcon"><Link to="https://www.pinterest.com/americanbeautystar/" target="_blank"><PinterestIcon className="headerIcon" /></Link></div>
              </div>
              <div className="navSearchIcon">
                <div className="searchIcon"><Link to="/search/%20"><SearchIcon className="headerIcon" /></Link></div>
              </div>
              {/* <div className="showTime">
                  <img src="http://amer-bstar-prod-s3-assets-zngq8vlxtpl7.s3-us-west-2.amazonaws.com/wp-content/uploads/2017/10/04212023/project-runway.png" />
              </div> */}

            </div>
          </AppBar>
        </div>
        <div className={spacerDisplayClass}></div>
      </span>
    );
  }
}
