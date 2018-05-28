import React, { Component } from 'react';
import ReactDOM, { findDOMNode } from 'react-dom';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import ColorDiv from '../../components/ColorDiv/ColorDiv';
import { load as loadBio } from 'redux/modules/bio';
import config from '../../config';
import { Link } from 'react-router';
import Player from '../../components/Player/Player';
import FacebookIcon from 'material-ui-community-icons/icons/facebook-box';
import TwitterIcon from 'material-ui-community-icons/icons/twitter-box';
import InstagramIcon from 'material-ui-community-icons/icons/instagram';
import LinkedInIcon from 'material-ui-community-icons/icons/linkedin-box';
import YouTubeIcon from 'material-ui-community-icons/icons/youtube-play';
import SnapchatIcon from 'material-ui-community-icons/icons/snapchat';
import PlaceHolder from '../../components/DynamicPlaceHolder/DynamicPlaceHolder';

@connect(state => ({
  bio: state.bio.bio,
  bioLoaded: state.bio.loaded,
  bioLoading: state.bio.loading,
  bioError: state.bio.error,
}), { loadBio })

export default class Bio extends Component {
  static propTypes = {
    loadBio: PropTypes.func.isRequired,
    route: PropTypes.object.isRequired,
    bio: PropTypes.array,
    bioLoaded: PropTypes.bool,
    bioLoading: PropTypes.bool,
    bioError: PropTypes.object,
    params: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object
  };

  constructor() {
    super();
    this.state = {
      playerBlock: {
        width: "45%",
        height: "auto",
        left: "25%",
      },
      fullScreenAboutBlockStyle: {
        width: "55%",
        left: "0px"
      },
      smallScreen: false,
      centeredContent: false,
    };
  }

  componentWillMount() {
    // Pass the slug and the path so we can tell if it's a judge or host
    this.props.loadBio(this.props.params.slug, this.props.location.pathname);
    this.formatLargeScreenAboutBlock();
  }

  componentDidMount() {
    let parallax = document.querySelectorAll(".parallax");
    let speed = 0.1;
    window.addEventListener("resize", this.checkPlayerBoxSizeAndLocation, {passive: true});
    window.addEventListener("load", this.checkPlayerBoxSizeAndLocation, {passive: true});
    window.addEventListener("resize", this.formatLargeScreenAboutBlock, {passive: true});
    window.addEventListener("load", this.formatLargeScreenAboutBlock, {passive: true});
    this.formatLargeScreenAboutBlock();
    this.checkPlayerBoxSizeAndLocation();
    this.handleResize();
    window.addEventListener("resize", this.handleResize, {passive: true});
    window.addEventListener("load", this.handleResize, {passive: true});

    window.onscroll = function() {
      [].slice.call(parallax).forEach(function(el, i) {
        let windowYOffset = window.pageYOffset;
        let elBackgrounPos = "50% " + (windowYOffset * speed) + "px";

        el.style.backgroundPosition = elBackgrounPos;
      });
    };
  }


  componentWillReceiveProps(nextProps)  {
    this.formatLargeScreenAboutBlock();
    if (nextProps.params.slug !== this.props.params.slug) {
      this.props.loadBio(nextProps.params.slug, nextProps.location.pathname);
      this.checkPlayerBoxSizeAndLocation();
      this.forceUpdate();
    }
  }

  componentWillUnmount() {
      window.removeEventListener("resize", this.checkPlayerBoxSizeAndLocation);
      window.removeEventListener("load", this.checkPlayerBoxSizeAndLocation);
      window.removeEventListener("resize", this.handleResize);
      window.removeEventListener("load", this.handleResize);
      window.removeEventListener("resize", this.formatLargeScreenAboutBlock);
      window.removeEventListener("load", this.formatLargeScreenAboutBlock);
  }

  handleResize = (event) => {
      this.setState({
        smallScreen: window.innerWidth <= 1100
      });
  }

  handleOthersClick(event, url) {
    // event.preventDefault();
  }

formatLargeScreenAboutBlock() {
  if (this.props.route.bioType === "host") {
    this.setState({
      fullScreenAboutBlockStyle: {
        width: "75%",
        left: "12.5%"
      }
    });
  } else {
    this.setState({
      fullScreenAboutBlockStyle: {
        width: "55%",
        left: "0%"
      }
    });
  }
}

checkPlayerBoxSizeAndLocation = (event) => {
  let refAboutBox = this.refs.aboutBlock;
  let refPlayer = this.refs.playerBlock;
  let aboutBoxRect = undefined;
  let playerRect = undefined;
  try {
    aboutBoxRect = refAboutBox.getBoundingClientRect();
    playerRect = refPlayer.getBoundingClientRect();
  } catch (e) {
    // well... I tried...
  }
  if (aboutBoxRect !== undefined && playerRect !== undefined) {
    let aboutBoxWidth = aboutBoxRect.width;
    let aboutBoxLeft = aboutBoxRect.left;
    // determine and assign the width and height of the player box
    let playerWidth = aboutBoxWidth * 0.8;
    let playerHeight = playerWidth * 0.5625;

    // determine and assign the left position of the player box
    let playerLeft = (aboutBoxLeft + (aboutBoxWidth-playerWidth)/2);

    this.setState({
      playerBlock: {
        width: playerWidth + 'px',
        height: playerHeight + 'px',
        left: playerLeft + 'px',
      }
    });
  }
}

  render() {
    let topImage = "";
    let videoID = "";
    let topTitle = "";
    let topContent = "";
    let topQuote = "";
    let creativeBackground = "";
    let creativeTitle = "";
    let creativeText = "";
    let quoteBoxBgColor = "";
    let quoteBoxImgURL = "";
    let otherLinksArray = [];
    let creativeVidLinksArray = [];
    let VideoArea = ( <PlaceHolder size="160x90" /> );
    let parallaxStyle = {};
    let quoteBoxImg = {};
    let videoAreaStyle = {backgroundColor: '#000'};
    let quoteBoxStyle = {display: 'none'};
    let pathName = this.props.location.pathname;
    let socialFeedFacebookURL = "";
    let socialFeedInstagramURL = "";
    let socialFeedLinkedInURL = "";
    let socialFeedTwitterURL = "";
    let socialFeedSnapchatURL = "";
    let socialFeedYoutubeURL = "";
    let socialFeedArray = [];
    let teamMate = {};
    let teamMateTitle = "";
    let teamMateArea = "";
    let teamMateImg = "";
    let extLinkBkgImg = "";
    let headShotImg = "";
    let creativeBoxStyle = {display: 'none'};
    let bioType = pathName.split("/")[2];  // judge, host, contestant
    let creativeArea = null;
    if (this.props.bioLoaded && this.props.bio) {
      this.props.bio.forEach((bio, ind) => {
        console.log(bio.meta);
        if (bio.post_name === this.props.params.slug) {
          topImage = bio.meta.dspabs_background && bio.meta.dspabs_background[0] && bio.meta.dspabs_background[0].image ? bio.meta.dspabs_background[0].image.url : "";
          videoID = bio.meta.dspabs_video_id || "";
          topTitle = bio.post_title || "";
          topContent = bio.post_content || "";
          topQuote = bio.meta.dspabs_quote || "";
          quoteBoxBgColor = bio.meta.dspabs_quote_bg_color && bio.meta.dspabs_quote_bg_color[0] ? bio.meta.dspabs_quote_bg_color[0] : "#FB0086";
          quoteBoxImgURL = bio.meta.dspabs_quote && bio.meta.dspabs_quote[0] && bio.meta.dspabs_quote[0].image ? bio.meta.dspabs_quote[0].image.url : "";
          creativeTitle = bio.meta.dspabs_creative_title || "";
          creativeText =  bio.meta.dspabs_creative_text || "";
          creativeBackground = bio.meta.dspabs_creative_background && bio.meta.dspabs_creative_background[0] && bio.meta.dspabs_creative_background[0].image ? bio.meta.dspabs_creative_background[0].image.url : "";
          socialFeedFacebookURL = bio.meta.social_feed_facebook && bio.meta.social_feed_facebook[0] ?  bio.meta.social_feed_facebook[0] : "";
          socialFeedYoutubeURL = bio.meta.social_feed_youtube && bio.meta.social_feed_youtube[0] ?  bio.meta.social_feed_youtube[0] : "";
          socialFeedTwitterURL = bio.meta.social_feed_twitter && bio.meta.social_feed_twitter[0] ?  bio.meta.social_feed_twitter[0] : "";
          socialFeedInstagramURL = bio.meta.social_feed_instagram && bio.meta.social_feed_instagram[0] ?  bio.meta.social_feed_instagram[0] : "";
          socialFeedLinkedInURL = bio.meta.social_feed_linkedin && bio.meta.social_feed_linkedin[0] ?  bio.meta.social_feed_linkedin[0] : "";
          socialFeedSnapchatURL = bio.meta.social_feed_snapchat && bio.meta.social_feed_snapchat[0] ?  bio.meta.social_feed_snapchat[0] : "";
          teamMate = bio.meta.dspabs_teammate && bio.meta.dspabs_teammate[0] ? bio.meta.dspabs_teammate[0] : null;

          if (bio && bio.meta && bio.meta.dspabs_headshot && bio.meta.dspabs_headshot[0].image && bio.meta.dspabs_headshot[0].image.url) {
            headShotImg = (
              <div className="headShot" style={{backgroundImage: "url(" + bio.meta.dspabs_headshot[0].image.url + ")"}}>
                <PlaceHolder size="100x100" />
              </div>
            );
          }

          if (teamMate !== null) {
            teamMateTitle = <h1>Teammate: <br /><span className="teammate-name">{teamMate.post_title}</span></h1>;
            if (teamMate.meta.dspabs_headshot && teamMate.meta.dspabs_headshot.image && teamMate.meta.dspabs_headshot.image.url) {
              teamMateImg = (
                <div className="teamMateheadShot" style={{backgroundImage: "url(" + teamMate.meta.dspabs_headshot.image.url + ")"}}>
                  <PlaceHolder size="100x100" />
                </div>
              );
            }
            teamMateArea = (
              <div className="bio-teammate">
                {teamMateTitle}
                <div className="teammate-desc">
                  {teamMateImg}
                  <div className="teammate-text" dangerouslySetInnerHTML={{__html: teamMate.post_content }} />
                </div>
              </div>
            );
          }
          videoAreaStyle = {backgroundColor: quoteBoxBgColor};
          creativeArea = creativeText.length !== 0 ? <span><div className="creative-box-text" dangerouslySetInnerHTML={{__html: creativeText }} /></span> : null;
          creativeBoxStyle.display = creativeArea !== null ? "block" : "none";
          if (socialFeedFacebookURL !== "" && (socialFeedFacebookURL.indexOf("http://") !== -1 || socialFeedFacebookURL.indexOf("https://") !== -1)) {
            socialFeedArray.push(
              <div className="social-feed-icon" key={'fb'}><Link to={socialFeedFacebookURL} target="_blank"><FacebookIcon className="social-icon" /></Link></div>
            );
          }
          if (socialFeedYoutubeURL !== "" && (socialFeedYoutubeURL.indexOf("http://") !== -1 || socialFeedYoutubeURL.indexOf("https://") !== -1)) {
            socialFeedArray.push(
              <div className="social-feed-icon" key={'yt'}><Link to={socialFeedYoutubeURL} target="_blank"><YouTubeIcon className="social-icon" /></Link></div>
            );
          }
          if (socialFeedTwitterURL !== "" && (socialFeedTwitterURL.indexOf("http://") !== -1 || socialFeedTwitterURL.indexOf("https://") !== -1)) {
            socialFeedArray.push(
              <div className="social-feed-icon" key={'tw'}><Link to={socialFeedTwitterURL} target="_blank"><TwitterIcon className="social-icon" /></Link></div>
            );
          }
          if (socialFeedInstagramURL !== "" && (socialFeedInstagramURL.indexOf("http://") !== -1) || socialFeedInstagramURL.indexOf("https://") !== -1) {
            socialFeedArray.push(
              <div className="social-feed-icon" key={'ig'}><Link to={socialFeedInstagramURL} target="_blank"><InstagramIcon className="social-icon" /></Link></div>
            );
          }
          if (socialFeedLinkedInURL !== "" && (socialFeedLinkedInURL.indexOf("http://") !== -1 || socialFeedLinkedInURL.indexOf("httsp://") !== -1)) {
            socialFeedArray.push(
              <div className="social-feed-icon" key={'ln'}><Link to={socialFeedLinkedInURL} target="_blank"><LinkedInIcon className="social-icon" /></Link></div>
            );
          }
          if (socialFeedSnapchatURL !== "" && (socialFeedSnapchatURL.indexOf("http://") !== -1 || socialFeedSnapchatURL.indexOf("https://") !== -1)) {
            socialFeedArray.push(
              <div className="social-feed-icon" key={'sc'}><Link to={socialFeedSnapchatURL} target="_blank"><SnapchatIcon className="social-icon" /></Link></div>
            );
          }
          if (quoteBoxImgURL !== "") {
            quoteBoxStyle = {backgroundColor: quoteBoxBgColor};
          }
          parallaxStyle = {
            backgroundImage: 'url(' + creativeBackground + ')'
          };
          if (bio.meta.dspabs_creative_subimages) {
            bio.meta.dspabs_creative_subimages[0].forEach((img, idx) => {
              const lnk = img.link.indexOf('://') > -1 && img.link.indexOf('americanbeautystar.com') < 0 ? <a href={img.link} target={'_blank'}><img className="creativeVidLinkImg img img-fluid" src={(img.image.image.url : false)}/></a> : <Link to={img.link}><img className="creativeVidLinkImg img img-fluid" src={(img.image.image.url : false)}/></Link>;
              creativeVidLinksArray.push(
                <div key={idx} className="creativeVidLink">
                    <div>{lnk}</div>
                </div>
              );
            });
          }
          if (bio.meta.dspabs_video_id) {
            VideoArea = (
              <Player
                video_id={bio.meta.dspabs_video_id[0] || '0'}
                nextVideo={'0'}
                historyObj={this.props.history}
                locationObj={this.props.location}
                options={{'loopplayback': false, 'playercontrolbar': false, 'noCollapse': this.state.smallScreen, 'autostart': false, autostartNext: false}}
                yOffset = {160}
                innerWrapperWidth = "100%"
              />);
          }
        } // else {
          extLinkBkgImg = bio && bio.meta && bio.meta.dspabs_headshot && bio.meta.dspabs_headshot[0].image && bio.meta.dspabs_headshot[0].image.url ? bio.meta.dspabs_headshot[0].image.url : "";
          if (extLinkBkgImg !== "") {
            otherLinksArray.push(
                <div key={ind} className="externalLink">
                  <Link to={"/show/" + bioType + "/" + bio.post_name} onClick={this.handleOthersClick.bind(this, "/show/" + bioType + "/" + bio.post_name)}>
                    <div className="externalLinkImgContainer" style={{backgroundImage: "url(" + extLinkBkgImg + ")", backgroundSize: "cover"}}>
                        <PlaceHolder className="externalLinkImg" size="100x100" />
                    </div>
                    <div className="externalLinkName"><span>{bio.post_title}</span></div>
                  </Link>
                </div>
              );
            }
          // }
      });
    }

    const largeScreenContent = (
      <div className="largeScreenContent" style={{backgroundImage: "url(https://d1bud3tr8474k6.cloudfront.net/wp-content/uploads/2017/08/29192108/abs-logo-tilted3.png)"}}>
      <div className="playerBlock" ref="playerBlock" style={{width: this.state.playerBlock.width, height: this.state.playerBlock.height, left: this.state.playerBlock.left}}>{VideoArea}</div>
        <div className="topImage" style={{backgroundImage: "url(" + topImage + ")"}}>
          <PlaceHolder size="1000x500" />
        </div>
        <div className="section-1">
          <div className="topArea">
             <div className="about-block" style={this.state.fullScreenAboutBlockStyle} ref="aboutBlock">
               <div className="bio-social-sharing-container">
                 <div className="bio-social-sharing">{socialFeedArray}</div>
               </div>
               <div className="bio-text" ref="bio-text">
                 <div className="bio-title"><h1>{topTitle}</h1></div>
                 <div className="bio-description">
                   {headShotImg}<div className="bio-text-content"><span dangerouslySetInnerHTML={{ __html: topContent }}></span></div>
                 </div>
                 <div className="teamMate">
                 {teamMateArea}
               </div>
               </div>
             </div>
             <div className="others-block" style={{display: otherLinksArray.length === 1 ? "none" : "block"}}>
                <div className={'others-links bio-' + bioType}>{otherLinksArray}</div>
             </div>
          </div>
      </div>
      <div className="row nopadding">
        <div className="col-xs-12 nopadding section-3"  style={quoteBoxStyle}>
          <div className="top-quote-block">
            <div className="quote-container">
              <img src={quoteBoxImgURL} className="img img-fluid" />
            </div>
          </div>
        </div>
      </div>
      <div className="row nopadding"  style={creativeBoxStyle}>
        <div className="col-xs-12 nopadding section-4 parallax" style={parallaxStyle}>
          <div className="creative-box-container" style={creativeBoxStyle}>
            <div className="creative-box">
              <div className="creative-box-content">
                    <div className="row nopadding">
                      <div className="col-xs-12 nopadding">
                        <div className="creative-box-title"><h1>{creativeTitle}</h1></div>
                      </div>
                    </div>
                    <div className="row nopadding">
                      <div className="col-xs-12 nopadding">
                        {creativeArea}
                      </div>
                    </div>
                    <div className="row nopadding">
                      <div className="col-xs-12 nopadding">
                        <div className="creative-vid-links-container">{creativeVidLinksArray}</div>
                      </div>
                    </div>
                  </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );


    const smallScreenContent = (
      <div className="smallScreenContent">
      <div className="row nopadding">
        <div className="col-xs-12 nopadding cover-img">
           <div className="videoArea">{VideoArea}</div>
        </div>
      </div>
      <div className="row nopadding">
        <div className="col-xs-12 nopadding">
          <div className="bio-text" ref="bio-text">
             <div className="about-block" ref="aboutBlock">
                 <div className="bio-title">
                   <h1>{topTitle}</h1>
                   <div className="bio-social-sharing">{socialFeedArray}</div>
                 </div>
                 <div className="bio-description">
                   {headShotImg}<div dangerouslySetInnerHTML={{ __html: topContent }}></div>
                 </div>
               </div>
             </div>
        </div>
      </div>
      <div className="row nopadding">
        <div className="col-xs-12 nopadding">
             <div className="quote-box" style={quoteBoxStyle}>
               <div className="quote-box-inner">
                 <img src={quoteBoxImgURL} className="img img-fluid" />
               </div>
             </div>
        </div>
      </div>
      <div className="row nopadding">
        <div className="col-xs-12 nopadding">
          <div className="teamMate">
            {teamMateArea}
          </div>
        </div>
      </div>
      <div className="row nopadding" style={creativeBoxStyle}>
        <div className="col-xs-12 nopadding creative-content parallax" style={parallaxStyle}>
          <div className="creative-box-container" style={creativeBoxStyle}>
            <div className="creative-box">
              <div className="creative-box-content">
                <div className="row nopadding">
                  <div className="col-xs-12 nopadding">
                    <div className="creative-box-title"><h1>{creativeTitle}</h1></div>
                  </div>
                </div>
                <div className="row nopadding">
                  <div className="col-xs-12 nopadding">
                    {creativeArea}
                  </div>
                </div>
                <div className="row nopadding">
                  <div className="col-xs-12 nopadding">
                    <div className="creative-vid-links-container">{creativeVidLinksArray}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row nopadding">
        <div className="col-xs-12 nopadding">
            <div className={'others-links bio-' + bioType}>{otherLinksArray}</div>
        </div>
      </div>
    </div>
    );

    const pageContent = (
      (this.state.smallScreen && smallScreenContent) || (!this.state.smallScreen && largeScreenContent)
    );

    return (
       <div className="bio">
        <Helmet title="Bio"/>
        {pageContent}
      </div>
    );
  }
}
