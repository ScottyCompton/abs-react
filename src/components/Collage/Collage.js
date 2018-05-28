import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import CastMember from './CastMember';
import { getCollageData } from 'redux/modules/collage';
import PlaceHolder from '../../components/DynamicPlaceHolder/DynamicPlaceHolder';

@connect(state => ({
    token: state.apiAccess.token,
    collageData: state.collage.collageData,
    cast: state.collage.cast,
    loading: state.collage.loading,
    loaded: state.collage.loaded,
    error: state.collage.error
  }), { getCollageData }
)

export default class Collage extends Component {
  static propTypes = {
    collageSlug: PropTypes.string.isRequired,
    collageData: PropTypes.object,
    getCollageData: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    loaded: PropTypes.bool,
    error: PropTypes.object,
    defaultView: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      canvasWidth: 0,
      canvasHeight: 0,
      interval: 0,
      castMemberState: []
    };
    this.handleResize = this.handleResize.bind(this);
    this.handleLoad = this.handleLoad.bind(this);
    this.updateCastMembers = this.updateCastMembers.bind(this);
  }


  componentWillMount() {
    const { collageSlug} = this.props;
    this.props.getCollageData(collageSlug);
    window.addEventListener("resize", this.handleResize, {passive: true});
    window.addEventListener("load", this.handleLoad, {passive: true});
    window.addEventListener("load", this.handleResize, {passive: true});
    setTimeout(function() {
      this.handleLoad();
    }.bind(this), 1000);
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("load", this.handleResize);
  }

  updateCastMembers() {
    let aryData = this.state.castMemberState;
    let aryOut = [];
    let interval = this.state.interval + 50;
    // if (strStatus.indexOf('false') !== -1) {
      for (let i = 0; i <= aryData.length-1; i++) {
        let loadTime = aryData[i].castMemberLoadTime;
        let showNow = (loadTime <= interval) && !aryData[i].castMemberShowNow;
        aryOut[i] = {
          castMemberShowNow: showNow,
          castMemberLoadTime: loadTime
        };
      }
      this.setState({
        castMemberState: aryOut,
        interval: interval
      });
  }

  handleLoad() {
    let castMemberState = this.state ? this.state.castMemberState : {};
    let cast = this.props && this.props.collageData && this.props.collageData.dspabs_collage_cast ? this.props.collageData.dspabs_collage_cast : [];
    let aryData = [];
    if (cast.length > 0) {
      for (let i = 0; i <=cast.length-1; i++) {
        aryData[i] = {
          castMemberLoadTime: Math.random() * 2000,
          castMemberShowNow: false
        };
      }
    }
    this.setState({
      castMemberState: aryData
    });


    let timer = setInterval(this.updateCastMembers, 50);
    setTimeout(function() {
      window.clearInterval(timer);
    }, 2050);
  }

  handleResize() {
    const aspectRatio = this.props && this.props.collageData && this.props.collageData && this.props.collageData.dspabs_collage_aspect_ratio ? this.props.collageData.dspabs_collage_aspect_ratio : 1;
    this.setState({
      canvasWidth: window.innerWidth,
      canvasHeight: window.innerWidth / aspectRatio
    });
  }

  render() {
    const styles = require('./Collage.less');
    const { collageData, loading, loaded, defaultView, error } = this.props;
    let collageClassName = "";
    let collageAspectRatio = 1;
    let placeholderSize = "";
    let collageCSS = "";
    let castMembers = [];
    let cast = [];
    let content = {};

    let defaultContent = (
      <span style={{display: error ? "block" : "none"}}>
        {defaultView}
      </span>
    );

    if (loaded && !loading && collageData && collageData.dspabs_collage_slug) {
        collageClassName = collageData.dspabs_collage_class_name ? collageData.dspabs_collage_class_name : "";
        collageAspectRatio = collageData.dspabs_collage_aspect_ratio ? collageData.dspabs_collage_aspect_ratio : 1;
        collageCSS = collageData.dspabs_collage_css ? collageData.dspabs_collage_css : "";
        placeholderSize = (collageAspectRatio * 100).toString() + "x100";
        cast = collageData.dspabs_collage_cast;
        let canvasWidth = this.state.canvasWidth !== 0 ? this.state.canvasWidth : window.innerWidth;
        let canvasHeight = this.state.canvasHeight !== 0 ? this.state.canvasHeight : window.innerWidth / collageAspectRatio;
        if (cast && cast.length > 0) {
          cast.map((item, index) => {
            let showState = this.state && this.state.castMemberState && this.state.castMemberState[index] && this.state.castMemberState[index].castMemberShowNow ? this.state.castMemberState[index].castMemberShowNow : false;
            castMembers.push(
              <CastMember key={index} detail={item} showNow={showState} canvasWidth={canvasWidth} canvasHeight={canvasHeight} />
            );
          });
        }
      content =  (
          <span>
            <div className="collageContainer">
              <PlaceHolder size={placeholderSize} />
              <div className={"collage " + collageClassName}>
                {castMembers}
              </div>
            </div>
            <style type="text/css" dangerouslySetInnerHTML={{__html: collageCSS }} />
          </span>
        );
    } else {
      if (defaultView && !collageData.dspabs_collage_slug) {
        content = defaultContent;
      } else {
        content = <span></span>;
      }
    }

    return (
      content
    );
  }
}
