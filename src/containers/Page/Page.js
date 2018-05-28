import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { load as loadPostBySlug, clean as cleanPostBySlug } from 'redux/modules/post';
import ColorDiv from '../../components/ColorDiv/ColorDiv';
import FacebookIcon from 'material-ui-community-icons/icons/facebook-box';
import TwitterIcon from 'material-ui-community-icons/icons/twitter-box';
import InstagramIcon from 'material-ui-community-icons/icons/instagram';
import TumblrIcon from 'material-ui-community-icons/icons/tumblr';
import EmailIcon from 'material-ui-community-icons/icons/email';
import PinterestIcon from 'material-ui-community-icons/icons/pinterest';
import InstagramCard from '../../components/InstagramCard/InstagramCard';

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

  componentWillMount() {
    const { content } = this.props;
    // Figure out if we already have a full content property and check to see if it matches our current slug
    const hasContent = content && content.post_name && content.post_name !== this.props.params.slug;
    if (this.props.error || !this.props.loaded || hasContent) {
      this.props.loadPostBySlug(this.props.params.slug);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.route.postType !== this.props.route.postType || nextProps.params.slug !== this.props.params.slug) {
      this.props.loadPostBySlug(nextProps.params.slug);
    }
  }

  render() {
    const { loading, loaded, content } = this.props;
    if (!loading && loaded && content && content.meta) {
      const customCSS = content.meta.dspabs_css && content.meta.dspabs_css.length >0 ? content.meta.dspabs_css : "";
      const dateParsed = new Date(content.post_date);
      const date = dateParsed ? ( dateParsed.getMonth() + 1 )  + "/" + dateParsed.getDate() + "/" + dateParsed.getFullYear() : "";
      const breadcrumb = [(<li key="0">Home</li>)];
      breadcrumb.push(<li key="1"><Link to={"/pages/" + content.post_name }>{content.post_title}</Link></li>);

      if (content.taxonomy && content.taxonomy[0] && content.taxonomy[0].name) breadcrumb.push(<li key="2"><Link to={"/" + this.props.route.postType + "/" + content.taxonomy[0].name}>{content.taxonomy[0].name}</Link></li>);
      let blurbText = content.meta && content.meta.dspabs_blurb && content.meta.dspabs_blurb[0] || "";
      let blurbArea = "";
      if (blurbText !== "") {
        blurbArea = (<div className="row nopadding">
          <div className="col-xs-12 nopadding blurbArea">
            <div className="blurbText" dangerouslySetInnerHTML={{ __html: blurbText }}></div>
          </div>
        </div>);
      }

      let adScript = "";
      if (content.meta.dspabs_blog_page_ads_script && content.meta.dspabs_blog_page_ads_script[0]) {
        adScript = content.meta.dspabs_blog_page_ads_script[0];
      }


      return (
        <div className="post">
          <style type="text/css" dangerouslySetInnerHTML={{ __html: customCSS }} />
          <ColorDiv ColorsToDisplay={['#FB0086']} LineHeight="1.0vh" />
          <Helmet title={content.post_title}/>

          {/* Left-hand column contains email signup, ad slot, and Instagram container  */}
          <div className="aLittleSpace"></div>
          <div className="row nopadding">
            <div className="hidden-xs hidden-sm hidden-md col-lg-3 secondaryContent">
              <div className="instagram">
                <InstagramCard profile="americanbeautystar"/>
              </div>
              <div className="advertSlot">
                <div className="blog-ad-script" dangerouslySetInnerHTML={{ __html: adScript }} />
              </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-11 col-lg-9 primaryContent nopadding">
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
                </div>
                {blurbArea}
                <div className="row nopadding">
                  <div className="col-xs-12 nopadding">
                      <div className="content" dangerouslySetInnerHTML={{ __html: content.post_content }}></div>
                  </div>
                </div>
            </div>
          </div>

          <ColorDiv ColorsToDisplay={['#FB0086']} LineHeight="1.0vh" />
          </div>
        </div>
      );
    } else {
      return (
        <div className="placeholder">
          <Helmet title="American Beauty Star"/>
          <div>We could put a placeholder component of some sort here maybe?</div>
        </div>
      );
    }
  }
}
