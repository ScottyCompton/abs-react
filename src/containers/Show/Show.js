import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import ColorDiv from '../../components/ColorDiv/ColorDiv';
import RaisedButton from 'material-ui/RaisedButton';
import { load as loadShowFeaturedCarousel } from 'redux/modules/showFeaturedCarousel';
import { load as loadShowFeaturedSections } from 'redux/modules/showFeaturedSections';
import { load as loadFeaturedOptions } from 'redux/modules/featuredOptions';
import Player from '../../components/Player/Player';
import PlaceHolder from '../../components/DynamicPlaceHolder/DynamicPlaceHolder';
import Collage from '../../components/Collage/Collage';

@connect(state => ({
  token: state.apiAccess.token,
  showSlides: state.showFeaturedCarousel.slides,
  showSlidesLoaded: state.showFeaturedCarousel.loaded,
  showSlidesLoading: state.showFeaturedCarousel.loading,
  showSlidesError: state.showFeaturedCarousel.error,
  showSections: state.showFeaturedSections.sections,
  showSectionsLoaded: state.showFeaturedSections.loaded,
  showSectionsLoading: state.showFeaturedSections.loading,
  showSectionsError: state.showFeaturedSections.error,
  options: state.featuredOptions.options,
  loaded: state.featuredOptions.loaded,
  loading: state.featuredOptions.loading,
  error: state.featuredOptions.error,
}), { loadShowFeaturedCarousel, loadShowFeaturedSections, loadFeaturedOptions })

export default class Show extends Component {

  static propTypes = {
    token: PropTypes.string.isRequired,
    loadShowFeaturedCarousel: PropTypes.func.isRequired,
    loadShowFeaturedSections: PropTypes.func.isRequired,
    loadFeaturedOptions: PropTypes.func.isRequired,
    showSlides: PropTypes.array,
    showSlidesLoaded: PropTypes.bool,
    showSlidesLoading: PropTypes.bool,
    showSlidesError: PropTypes.object,
    showSections: PropTypes.array,
    showSectionsLoaded: PropTypes.bool,
    showSectionsLoading: PropTypes.bool,
    showSectionsError: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object,
    options: PropTypes.object,
    error: PropTypes.object,
    loaded: PropTypes.bool,
  };

  constructor() {
    super();
    this.state = {
      smallScreen: false,
      largeScreen: true,
    };
    this.handleResize = this.handleResize.bind(this);
  }

  componentWillMount() {
    if (this.props.showSlidesError || !this.props.showSlidesLoaded) {
      this.props.loadShowFeaturedCarousel();
    }
    if (this.props.showSectionsError || !this.props.showSectionsLoaded) {
      this.props.loadShowFeaturedSections();
    }
    if (this.props.error || !this.props.loaded) {
      this.props.loadFeaturedOptions();
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize, {passive: true});
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  handleVideoAreaClick() {
    const videoAreaLink = this.props.options.show_video_background && this.props.options.show_video_background.link ? this.props.options.show_video_background.link : "";
    if (videoAreaLink !== "") {
      window.open(videoAreaLink);
    }
  }

  handleResize = (event) => {
      this.setState({
        smallScreen: window.innerWidth <= 1100,
        largeScreen: window.innerWidth > 1100
      });
  }

  handleSliderImgMouseOut(ind) {
      let hoverStates = this.state ? this.state.hover : [];
      if (!hoverStates) hoverStates = [];
      hoverStates[ind] = false;
      this.setState({hover: hoverStates});
  }

  handleSliderImgHover(ind) {
      let hoverStates = this.state ? this.state.hover : [];
      if (!hoverStates) hoverStates = [];
      hoverStates[ind] = true;
      this.setState({hover: hoverStates});
  }

  render() {
    const posterAreaBkg = this.props.options.show_video_background && this.props.options.show_video_background.url ? this.props.options.show_video_background.url : "https://d1bud3tr8474k6.cloudfront.net/wp-content/uploads/2017/07/25205828/placeholder153x200.png";

    // Sections
    let sectionSlides = [];

    if (this.props.showSections && this.props.showSections.length > 0) {
      for (let a=0; a<this.props.showSections.length; a++) {
        let image = 'https://s3-us-west-1.amazonaws.com/ambeautystars/homerailmock1.png';
        if (this.props.showSections[a].featured_image) {
        // Featured image
          image = this.props.showSections[a].featured_image.url;
        } else if (this.props.showSections[a].meta && this.props.showSections[a].meta.dspabs_headshot && this.props.showSections[a].meta.dspabs_headshot[0].image) {
        // Headshot
          image = this.props.showSections[a].meta.dspabs_headshot[0].image.url;
        }

        let type = this.props.showSections[a].post_type;

        let category = this.props.showSections[a].taxonomy && this.props.showSections[a].taxonomy[0] && this.props.showSections[a].taxonomy[0].name ? this.props.showSections[a].taxonomy[0].name : "uncategorized";

        let url = ['look', 'article', 'tutorial'].indexOf(type) > -1 ? type + "s/" + category + "/" + this.props.showSections[a].post_name : "/show/" + type + "/" + this.props.showSections[a].post_name;

        sectionSlides.push(
            <div key={a} className="card">
              <div className="cardImg">
                <Link to={url}>
                  <PlaceHolder size="500x500" />
                  <div className={'cardFrontImg ' + (this.state !== null && this.state.hover && this.state.hover[a] ? 'homeSlideHover' : 'homeSlideOff')} style={{backgroundImage: 'url(' + image + ')'}} onMouseOver={() => this.handleSliderImgHover(a)} onMouseOut={() => this.handleSliderImgMouseOut(a)}  ref="slideImg"></div>
                </Link>
                <div className="card-text">
                  <h1>{this.props.showSections[a].meta ? this.props.showSections[a].meta.dspabs_featured_show_section_text : "Text"}</h1>
                </div>
              </div>
            </div>
          );
        }
    } else {
      for (let i= 0; i < 3; i++) {
        sectionSlides.push(
            <div className="card" key={i}>
              <div className="cardImg">
                <PlaceHolder size="500x500" />
                <div className="card-text"></div>
              </div>
            </div>
          );
      }
    }

    let posterContent = (
      <div className="showPoster"  style={{backgroundImage: "url(" + posterAreaBkg +")"}}>
        <PlaceHolder size="1500x450" bgColor="transparent" />
      </div>
    );

    let posterArea = (
      <div className="showPoster">
        <div className="showPosterArea">
          {this.state.smallScreen ? posterContent : <Collage collageSlug="all-abs-castmembers" defaultView={posterContent} />}
          <div className="showCards">
            {sectionSlides}
          </div>
        </div>
      </div>
    );

    return (
      <div className="show">
        <Helmet title="The Show"/>
        {posterArea}
      </div>
    );
  }
}
