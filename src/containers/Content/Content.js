import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { load as loadPostBySlug, clean as cleanPostBySlug } from 'redux/modules/post';
import FacebookIcon from 'material-ui-community-icons/icons/facebook-box';
import TwitterIcon from 'material-ui-community-icons/icons/twitter-box';
import InstagramIcon from 'material-ui-community-icons/icons/instagram';
import TumblrIcon from 'material-ui-community-icons/icons/tumblr';
import EmailIcon from 'material-ui-community-icons/icons/email';
import PinterestIcon from 'material-ui-community-icons/icons/pinterest';
import ColorDiv from '../../components/ColorDiv/ColorDiv';
import RandomPostBox from '../../components/RandomPostBox/RandomPostBox';
import InstagramCard from '../../components/InstagramCard/InstagramCard';
import Player from '../../components/Player/Player';
import ShopSlider from '../../components/ShopSlider/ShopSlider';
import Share from '../../components/Share/Share';

@connect(state => ({
  content: state.post.content,
  loading: state.post.loading,
  loaded: state.post.loaded,
  error: state.post.error
}), { loadPostBySlug, cleanPostBySlug })

export default class Content extends Component {
  static propTypes = {
    loadPostBySlug: PropTypes.func.isRequired,
    cleanPostBySlug: PropTypes.func,
    params: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    content: PropTypes.object,
    loading: PropTypes.bool,
    loaded: PropTypes.bool,
    error: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {
      smallScreen: false
    };
  }

  componentWillMount() {
    const { content } = this.props;
    // Figure out if we already have a full content property and check to see if it matches our current slug
    const hasContent = content && content.post_name && content.post_name !== this.props.params.slug;
    if (this.props.error || !this.props.loaded || hasContent) {
      this.props.loadPostBySlug(this.props.params.slug);
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize, {passive: true});
    window.addEventListener("load", this.handleResize, {passive: true});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.route.postType !== this.props.route.postType || nextProps.params.slug !== this.props.params.slug) {
      this.props.loadPostBySlug(nextProps.params.slug);
    }
  }

  componentWillUnmount() {
      window.removeEventListener("resize", this.handleResize);
      window.removeEventListener("load", this.handleResize);
    }

  handleResize = (event) => {
    this.setState({
      smallScreen: window.innerWidth <= 1100,
    });
  }

  stripHTML(theVal) {
    let rex = /(<([^>]+)>)/ig;
    return (
      theVal.replace(rex, "")
    );
  }

  formatDate(dte) {
    let arrDteTime = dte.split(" ");
    let arrDate = arrDteTime[0].split("-");
    let m = arrDate[1].substring(0, 1) === "0" ? arrDate[1].substr(1, 1) : arrDate[1];
    let d = arrDate[2].substring(0, 1) === "0" ? arrDate[2].substr(1, 1) : arrDate[2];
    return (m + "/" + d + "/" + arrDate[0]);
  }

  render() {
    const { loading, loaded, content } = this.props;
    let shareTitle = "";
    let shareDescription = "";
    let sharePoster = "";
    if (!loading && loaded && content && content.meta) {
      shareTitle = content.post_title;
      sharePoster = "https://d1bud3tr8474k6.cloudfront.net/wp-content/uploads/2017/08/08154416/Webp.net-resizeimage.png";

      // const dateParsed = new Date(content.post_date);
      // const date = dateParsed ? ( dateParsed.getMonth() + 1 )  + "/" + dateParsed.getDate() + "/" + dateParsed.getFullYear() : "";
      const date = this.formatDate(content.post_date);
      const breadcrumb = [(<li key="0">Blog</li>)];
      breadcrumb.push(<li key="1"><Link to={"/" + this.props.route.postType + "s"}>{this.props.route.postType + "s"}</Link></li>);
      const customCSS = content.meta.dspabs_css && content.meta.dspabs_css.length >0 ? content.meta.dspabs_css : "";
      if (content.taxonomy && content.taxonomy[0] && content.taxonomy[0].name) breadcrumb.push(<li key="2"><Link to={"/" + this.props.route.postType + "s#" + content.taxonomy[0].name}>{content.taxonomy[0].name}</Link></li>);
      let blurbText = content.meta && content.meta.dspabs_blurb && content.meta.dspabs_blurb[0] || "";
      let blurbArea = "";
      if (blurbText !== "") {
        shareDescription = blurbText;
        blurbArea = (<div className="row nopadding">
          <div className="col-xs-12 nopadding blurbArea">
            <div className="blurbText">{this.stripHTML(blurbText)}</div>
          </div>
        </div>);
      }
      let adScript = "";


      if (content.meta.dspabs_blog_page_ads_script && content.meta.dspabs_blog_page_ads_script[0]) {
        adScript = content.meta.dspabs_blog_page_ads_script[0];
      }

      let optionalVideo = "";

      if (content.meta.dspabs_video_id && content.meta.dspabs_video_id[0]) {
        let autostart = false;
        if (content.meta.dspabs_video_metabox_options_autostart && content.meta.dspabs_video_metabox_options_autostart[0]) {
          autostart =  content.meta.dspabs_video_metabox_options_autostart[0] === 1 ? true : false;
        }
        if (this.state.smallScreen) {
          optionalVideo  = (
                <Player
                  video_id={content.meta.dspabs_video_id[0] || '0'}
                  nextVideo={'0'}
                  historyObj={this.props.history}
                  locationObj={this.props.location}
                  options={{'loopplayback': true, 'playercontrolbar': false, 'autostart': autostart, 'noCollapse': true}}
                />);
        } else {
          optionalVideo  = (
                <Player
                  video_id={content.meta.dspabs_video_id[0] || '0'}
                  nextVideo={'0'}
                  historyObj={this.props.history}
                  locationObj={this.props.location}
                  options={{'loopplayback': true, 'playercontrolbar': false, 'autostart': autostart}}
                />);
        }
      }

      let SliderContentArray = [];
      let SliderContent = [];
      let shopLooks = content.meta.dspabs_buy_the_look && content.meta.dspabs_buy_the_look[0] ? content.meta.dspabs_buy_the_look[0] : [];
      for (let i = 0; i < shopLooks.length; i++) {
        const theSlug = 'shop-product-' + i;
        const theLink = shopLooks[i].link || "";
        const slideIdx = i + 1;
        const theThumb = shopLooks[i].image && shopLooks[i].image.image && shopLooks[i].image.image.url ? shopLooks[i].image.image.url : '';
        SliderContentArray.push(
            {
              thumb: theThumb,
              slug: theSlug,
              url: theLink
            }
        );
      }

      if (SliderContentArray.length > 0) {
        SliderContent.push(
          <span>
            <div className="row nopadding">
              <div className="col-xs-12 nopadding">
                <div className="shopSliderLabel">
                  <h3>SHOP THE LOOK</h3>
                </div>
              </div>
            </div>
            <div className="row nopadding">
              <div className="col-xs-12 nopadding">
                <div className="shopSlider">
                  <ShopSlider content={SliderContentArray} slug={this.props.params.slug} />
                </div>
              </div>
            </div>
            <div className="row nopadding">
              <div className="col-xs-12 nopadding">
                <div className="belowShopSlider"></div>
              </div>
            </div>
          </span>
        );
      }

      return (
        <div className="post">
          <style type="text/css" dangerouslySetInnerHTML={{ __html: customCSS }} />
          <ColorDiv ColorsToDisplay={['#fefdf9']} LineHeight="1.0vh" />
          <Helmet title={content.post_title}/>
          <div className="typeHeader">
            <h2>BLOG</h2>
          </div>

          {/* Left-hand column contains email signup, ad slot, and Instagram container  */}
          <div className="aLittleSpace"></div>
          <div className="row nopadding">
            <div className="hidden-xs hidden-sm hidden-md col-lg-3 secondaryContent">
              <div className="advertSlot">
                <div className="blog-ad-script" dangerouslySetInnerHTML={{ __html: adScript }} />
              </div>

              <div className="instagram">
                <InstagramCard profile="americanbeautystar"/>
              </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-9 primaryContent nopadding">
              {/* Right-hand column contains body   */}
              <div className="mainBody">
                <div className="row nopadding">
                  <div className="col-xs-12 nopadding">
                    <h3>{content.post_title}</h3>
                  </div>
                </div>
                <div className="row nopadding metaInfo">
                  <div className="col-xs-6 nopadding">
                    <div className="breadcrumb">
                      <ul>{ breadcrumb }</ul>
                    </div>
                  </div>
                  <div className="col-xs-6 nopadding">
                    <span className="postDate pull-right">{date}</span>
                  </div>
                </div>
                {blurbArea}
                {optionalVideo}
                <div className="row nopadding">
                  <div className="col-xs-12 nopadding">
                      <div className="content blogContent" dangerouslySetInnerHTML={{ __html: content.post_content }}></div>
                  </div>
                </div>
                <div className="row nopadding">
                  <div className="col-xs-12 nopadding">
                    <div className="socialSharing">
                      {loaded && <Share
                        title={shareTitle}
                        poster={sharePoster}
                        description={shareDescription}
                      />}
                    </div>
                  </div>
                </div>
                {SliderContent}
                <div className="row hidden-lg">
                  <div className="col-12-xs col-12-sm col-12-med  secondaryContent">
                    <div className="advertSlot">
                      <div className="blog-ad-script" dangerouslySetInnerHTML={{ __html: adScript }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ColorDiv ColorsToDisplay={['#FB0086']} LineHeight="1.0vh" />

          <RandomPostBox articleType={this.props.route.postType}/>
          {this.state.smallScreen &&
            <div className="instagram" style={{paddingTop: "4vh"}}>
              <InstagramCard profile="americanbeautystar"/>
            </div>}
        </div>
      );
    } else {
      return (
        <div className="placeholder">
          <Helmet title="American Beauty Star"/>
          &nbsp;
        </div>
      );
    }
  }
}
