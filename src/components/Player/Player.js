import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { browserHistory, connect } from 'react-redux';
import Script from 'react-load-script';
import { cleanIVPVideo, loadIVPVideo } from 'redux/modules/player';
import ReactGA from 'react-ga';
import config from '../../config';
import { findDOMNode } from 'react-dom';
import PlaceHolder from '../../components/DynamicPlaceHolder/DynamicPlaceHolder';
import PlayerAniBox from './PlayerAniBox';

// connect to the store so we can get/retrieve token
@connect(state => ({
    videoObj: state.player.video,
    loading: state.player.loading,
    token: state.apiAccess.token,
}), { loadIVPVideo, cleanIVPVideo })

export default class Player extends Component {
    static propTypes = {
      loadIVPVideo: PropTypes.func.isRequired,
      cleanIVPVideo: PropTypes.func.isRequired,
      token: PropTypes.string.isRequired,
      video_id: PropTypes.string.isRequired,
      loaded: PropTypes.bool,
      videoObj: PropTypes.object,
      previousVideo: PropTypes.string,
      nextVideo: PropTypes.string,
      loading: PropTypes.bool,
      error: PropTypes.object,
      historyObj: PropTypes.object,
      locationObj: PropTypes.object,
      options: PropTypes.object,
      yOffset: PropTypes.number,
      innerWrapperWidth: PropTypes.string,
      displayDelay: PropTypes.string,
    };

    static contextTypes = {
      router: React.PropTypes.object
    }

    constructor(props) {
      super(props);
      this.state = {
        playerClass: "playerContainer",
        playerTopStyle: {
            top: "0px!important",
            width: "100%",
            height: "auto",
            display: "block"
        },
        playerRendering: false,
        isAmimated: false,

        aniBoxParams: {
            display: "block",
            height: "0px",
            width: "0px"
        },
        scriptCalled: false,
        handleScriptLoad: false,
        playerResizing: false,
        playerAnimationCheck: false,
        triggeredByPlayerRendering: false,
        handlingScriptLoad: false
      };
      this.checkPlayerLocation = this.checkPlayerLocation.bind(this);
      this.initAniboxParams = this.initAniboxParams.bind(this);
    }

    componentWillMount() {
      window.playerUnmounted = false;
      // this.forceUpdate();
    }

    componentDidMount() {
      window.playerUnmounted = false;

      window.addEventListener("scroll", this.checkPlayerLocation, {
        passive: true
      });
      window.addEventListener("resize", this.checkPlayerLocation, {
        passive: true
      });
      const {token, video_id } = this.props;
      this.props.loadIVPVideo(token, video_id);
      // this.forceUpdate();
    }
    componentWillReceiveProps(nextProps) {
      // Reset the check for a rerender triggered by setting the playerRendering flag to false
      this.setState(() => {
          return {
              triggeredByPlayerRendering: false
          };
      });
      // console.log("Player received props...", nextProps);
      const switching = typeof dotstudiozPlayer !== 'undefined' && typeof dotstudiozPlayer.player !== 'undefined' && typeof dotstudiozPlayer.player.source_switch !== 'undefined' && dotstudiozPlayer.player.el_ !== null;
      // console.log("Switching", switching);
      if (this.state.playerRendering && !switching) return;
      this.setState(() => {
          return {
              playerRendering: true
          };
      });
      const { token, loading, historyObj } = this.props;
      const debug = config && config.staging ? JSON.parse(`${config.staging}`) : false;
      const defaults = {
          autostart: true,
          loopplayback: false,
          debug: debug
      };
      const mergedOpts = Object.assign(defaults, this.props.options);
      const goToNextVideo = this.goToNextVideo;
      if (nextProps.video_id !== this.props.video_id) {
        mergedOpts.video_id = nextProps.video_id;
        // console.log("Video is different");
        if (typeof dotstudiozPlayer !== 'undefined') {
            // console.log("Player class object is defined");
            if (typeof dotstudiozPlayer.player !== 'undefined' && typeof dotstudiozPlayer.player.source_switch !== 'undefined') {
              // console.log("player and source switch are not undefined");
              if (typeof dotstudiozPlayer.player !== 'undefined' && dotstudiozPlayer.player.el_ !== null) {
                // Switch the source instead of recreating the player, since we aren't unmounting
                // console.log("Should switch source");
                dotstudiozPlayer.player.source_switch(nextProps.video_id);
                this.playerReady(dotstudiozPlayer, nextProps.nextVideo);
              } else {
                // console.log("One");
                if (dotstudiozPlayer.player && dotstudiozPlayer.player.el_ !== null) {
                    dotstudiozPlayer.player.dispose();
                    delete dotstudiozPlayer.player;
                }
                dotstudiozPlayer.requireConfig();
                dotstudiozPlayer.startRender(mergedOpts);
                this.playerReady(dotstudiozPlayer, nextProps.nextVideo);
              }
            } else {
              // console.log("2");
              if (dotstudiozPlayer.player && dotstudiozPlayer.player.el_ !== null) {
                  dotstudiozPlayer.player.dispose();
                  delete dotstudiozPlayer.player;
              }
              dotstudiozPlayer.requireConfig();
              dotstudiozPlayer.startRender(mergedOpts);
              this.playerReady(dotstudiozPlayer, nextProps.nextVideo);
            }
            if (!loading) {
              this.props.loadIVPVideo(token, nextProps.video_id);
            }
          }
      } else if (typeof dotstudiozPlayer === 'undefined' && !this.state.handlingScriptLoad) {
        // console.log("3");
        // console.log("dotstudiozPlayer is undefined");
        mergedOpts.video_id = nextProps.video_id;
        const playerReady = setInterval(() => {
          // console.log("Nope");
          if (typeof dotstudiozPlayer === 'undefined') return;
          // console.log("Yep");
          clearInterval(playerReady);
          dotstudiozPlayer.requireConfig();
          dotstudiozPlayer.startRender(mergedOpts);
          this.playerReady(dotstudiozPlayer, nextProps.nextVideo);
        }, 500);
      }
    }

    componentWillUnmount() {
      // We need to set up an interval here because if we change pages, the player instantiation
      // doesn't stop if the player hasn't finished instantiating, which puts the player the next page.
      window.removeEventListener("scroll", this.checkPlayerLocation);
      window.removeEventListener("resize", this.checkPlayerLocation);
      if (!document.querySelector('.video-js')) return;
      if (typeof dotstudiozPlayer === 'undefined' || typeof dotstudiozPlayer.player === 'undefined' || this.state.playerRendering || this.state.scriptCalled || this.state.handleScriptLoading) {
        const playerCheck = setInterval(() => {
          if (typeof dotstudiozPlayer !== 'undefined' && typeof dotstudiozPlayer.player !== 'undefined') {
            clearInterval(playerCheck);
            if (!window.playerUnmounted) return;

            // dotstudiozPlayer.player.trigger('sendbeforeunload');
            if (dotstudiozPlayer.player.el_ !== null) {
              dotstudiozPlayer.player.off('endedReactPlayer');
              dotstudiozPlayer.player.pause();
            }
            dotstudiozPlayer.player.dispose();
            delete dotstudiozPlayer.player;
          }
        }, 250);
      } else if (typeof dotstudiozPlayer !== 'undefined' && typeof dotstudiozPlayer.player !== 'undefined') {
        // dotstudiozPlayer.player.trigger('sendbeforeunload');
        if (dotstudiozPlayer.player.el_ !== null) {
          dotstudiozPlayer.player.off('endedReactPlayer');
          dotstudiozPlayer.player.pause();
        }
        dotstudiozPlayer.player.dispose();
        delete dotstudiozPlayer.player;
      }

      window.playerUnmounted = true;
      const videos = document.querySelectorAll('video');
      if (videos && videos.forEach) {
        videos.forEach((elem) => {
          elem.parentNode.removeChild(elem);
        });
      }
      this.props.cleanIVPVideo();
    }

    relocatePlayer(w, h, t, cls) {
      this.setState({
        isAmimated: true,
        playerResizing: true,
        playerAnimationCheck: true,
        playerTopStyle: {
            display: "none",
        }
      });
      setTimeout(function() {
        let videoJS = document.getElementsByClassName('video-js')[0];
        this.setState({
          playerClass: cls,
          playerTopStyle: {
              top: t,
              width: w,
              height: h,
              display: "block",
          }
        });
        try {
          videoJS.style.width = w;
          videoJS.style.height = h;
        } catch (e) {
          // complain to someone who cares...
        }
        this.setState({
          // playerResizing: false,
          playerAnimationCheck: false
        });
      }.bind(this), 500);
    }

    initAniboxParams(w, h, l, t) {
      this.setState({
        aniBoxParams: {
            initialWidth: h,
            initialHeight: w,
            initialLeft: l,
            initialTop: t
        }
      });
    }

    checkPlayerLocation = (event) => {
      if (this.state.playerAnimationCheck) return;
      let yOffset = this.props.yOffset ? this.props.yOffset : 0;
      let spacerContainer = this.refs.playerContainerSpacer;
      if (spacerContainer === null || spacerContainer === undefined) {
          return;
      }
      let plcRect = spacerContainer.getBoundingClientRect();
      let plcH = plcRect.height;
      let plcW = plcRect.width;
      let plcBtm = plcRect.bottom;
      let plcLeft = plcRect.left;
      let plcTop = plcRect.top;
      let aniParams = {};
      let h = 130;
      let w = h * 1.77;
      let yPos = window.pageYOffset - yOffset;
      let noCollapse = this.props.options && this.props.options.noCollapse && this.props.options.noCollapse === true;
      let videoJS = document.getElementsByClassName('video-js')[0];
      let yDiff = (yPos - (plcBtm + Math.abs(plcH))) + plcH;
      if (this.state.aniBoxParams.height === "0px") {
        this.initAniboxParams(plcW, plcH, plcLeft, plcTop);
      }
      if (window.innerWidth >= 1100 && !noCollapse) {
        if (!this.state.playerAnimationCheck) {
          if (yDiff >= 0) {
              if (this.state.playerClass !== "playerContainer minimized") {
                aniParams.initialWidth = plcW + "px";
                aniParams.initialHeight = plcH + "px";
                aniParams.initialLeft = plcLeft + "px";
                aniParams.initialTop = plcTop + "px";
                aniParams.finalWidth = w + "px";
                aniParams.finalHeight = h + "px";
                aniParams.finalLeft = "20%";
                aniParams.finalTop = "6px";
                aniParams.position = "fixed";
                aniParams.finalClass = "playerContainer minimized";
                this.state.aniBoxParams = aniParams;
                this.relocatePlayer(aniParams.finalWidth, aniParams.finalHeight, aniParams.finalTop, aniParams.finalClass);
                return;
              }
          } else {
            if (this.state.playerClass !== "playerContainer") {
              aniParams.initialWidth = w + "px";
              aniParams.initialHeight = h + "px";
              aniParams.initialLeft = "0px";
              aniParams.initialTop = "0px";
              aniParams.finalWidth = plcW + "px";
              aniParams.finalHeight = plcH + "px";
              aniParams.finalLeft = "0px";
              aniParams.finalTop = "0px";
              aniParams.position = "absolute";
              aniParams.finalClass = "playerContainer";
              this.state.aniBoxParams = aniParams;
              this.relocatePlayer(aniParams.finalWidth, aniParams.finalHeight, aniParams.finalTop, aniParams.finalClass);
              return;
            }
          }
        }
      } else {
        if (this.state.playerClass !== "playerContainer") {
          aniParams.initialWidth = w + "px";
          aniParams.initialHeight = h + "px";
          aniParams.initialLeft = "0px";
          aniParams.initialTop = "0px";
          aniParams.finalWidth = plcW + "px";
          aniParams.finalHeight = plcH + "px";
          aniParams.finalLeft = "0px";
          aniParams.finalTop = "0px";
          aniParams.position = "absolute";
          aniParams.finalClass = "playerContainer";
          this.state.aniBoxParams = aniParams;
          this.relocatePlayer(aniParams.finalWidth, aniParams.finalHeight, aniParams.finalTop, aniParams.finalClass);
          return;
        }
      }
    }

    playerReady(dotstudiozPlayer, nextVideo) {
      const playerReady = setInterval(() => {
        if (window.playerUnmounted) {
          clearInterval(playerReady);
          return;
        }
        if (dotstudiozPlayer && dotstudiozPlayer.player && !window.playerUnmounted) {
          clearInterval(playerReady);
          // console.log("Testing playerReady");
          this.setState(() => {
            return {
              playerRendering: false,
              triggeredByPlayerRendering: true
            };
          });
          if (nextVideo && parseInt(nextVideo, 10) !== 0) {
            const setNext = () => {
                this.goToNextVideo(nextVideo);
            };
            dotstudiozPlayer.player.off("ended", setNext);
            dotstudiozPlayer.player.one("ended", setNext);
          }
          // GOOGLE ANALYTICS
          if (typeof dotstudiozPlayer.player === 'undefined') return;
          dotstudiozPlayer.player.on('play', () => {
            ReactGA.event({
              category: 'Play',
              action: 'PlayEvent',
              label: this.props.video_id,
              nonInteraction: true
            });
          }).on('first_frame', () => {
            ReactGA.event({
              category: 'Play',
              action: 'FirstFrame',
              label: this.props.video_id,
              nonInteraction: true
            });
          });
        }
      }, 500);
    }

    goToNextVideo(url) {
      const loc = this.props.locationObj;
      const next = loc.pathname.split('/');
      next.splice(-1);
      const nextUrl = next.join('/') + '/' + url;
      // console.log("NEXT URL: ", url, nextUrl);
      const router = this.context.router.push(url);
    }

    isBrowser() {
      return !(typeof document === "undefined" || typeof window === "undefined");
    }

    handleScriptError() {
      // console.log("Player Script could not load error");
    }

    handleScriptLoad() {
      // console.log("Handling script load...");
      if (this.state.scriptCalled) return;
      // console.log("Loading scripts...");
      this.setState(() => {
          return {
              scriptCalled: true,
              handlingScriptLoad: true
          };
      });
      const goToNextVideo = this.goToNextVideo;
      const {
          nextVideo,
          historyObj,
          options
      } = this.props;
      const playerReady = setInterval(() => {
        if (window.playerUnmounted) {
            // console.log('Player unmounted, nothing to render');
            clearInterval(playerReady);
            return;
        }

        if (typeof dotstudiozPlayer !== 'undefined') {
            clearInterval(playerReady);
            if (this.state.handleScriptLoad) return;
            this.setState(() => {
                return {
                    handleScriptLoad: true
                };
            });
            clearInterval(playerReady);
            dotstudiozPlayer.requireConfig();
            let debug = false;
            try {
              debug = JSON.parse(`${config.staging}`);
            } catch (e) {
              // Nothing to do here...
            }
            const defaults = {
              autostart: true,
              loopplayback: false,
              debug: debug
            };
            const mergedOpts = Object.assign(defaults, options);
            mergedOpts.video_id = this.props.video_id;
            dotstudiozPlayer.startRender(mergedOpts);
            this.setState(() => {
              return {
                handleScriptLoad: false,
                handlingScriptLoad: false
              };
            });
            // dotstudiozPlayer.player is undefined if the content is unavailable in the user's country.
            if (typeof dotstudiozPlayer.player === 'undefined') {
              const playerObjReady = setInterval(() => {
                if (typeof dotstudiozPlayer.player !== 'undefined') {
                  clearInterval(playerObjReady);
                  // console.log("Player is ready after initial script load 1");
                  this.playerReady(dotstudiozPlayer);
                }
              }, 500);
            } else {
              // console.log("Player is ready after initial script load 2");
              this.playerReady(dotstudiozPlayer);
            }
        } else {
          // console.log("dotstudiozPlayer is undefined...");
        }
      }, 500);
    }

    render() {
      const PlayerStyles = require('./Player.less');
      const { videoObj, previousVideo, nextVideo, options, innerWrapperWidth } = this.props;
      const defaults = { playercontrolbar: true };
      const mergedOpts = Object.assign(defaults, options);
      const url = `${config.playerHost}/player/${this.props.video_id}?targetelm=.player&companykey=${config.api.company_id}&autostart=true&enablesharing=false&skin=FB0086&pagetype=site&render=false`;
      const currentUrl = this.isBrowser() ? window.location.href : '';

      const wrapperStyle = { width: innerWrapperWidth };

      let script = '';
      if (typeof dotstudiozPlayer === 'undefined' && !this.state.scriptCalled && !this.state.playerRendering) {
        // console.log("Should load script for player.");
        script = ( <Script url = {url} onError = {this.handleScriptError.bind(this)} onLoad = {this.handleScriptLoad.bind(this)}/>);
        } else {
          if (typeof dotstudiozPlayer !== 'undefined' && !this.state.scriptCalled && !this.state.playerRendering && !this.state.playerResizing) {
            // console.log("Rerender triggeredByPlayerRendering?", this.state.triggeredByPlayerRendering);
            if (!this.state.triggeredByPlayerRendering) {
              // console.log("Should *NOT* load script for player.");
              if (dotstudiozPlayer.player && dotstudiozPlayer.player.el_ !== null) {
                dotstudiozPlayer.player.dispose();
                delete dotstudiozPlayer.player;
              }
              dotstudiozPlayer.requireConfig();
              let debug = false;
              try {
                debug = JSON.parse(`${config.staging}`);
              } catch (e) {
                // Nothing to do here...
              }
              const playerDefaults = {
                autostart: true,
                loopplayback: false,
                debug: debug
              };
              const mergedPlayerOpts = Object.assign(playerDefaults, this.props.options);
              mergedPlayerOpts.video_id = this.props.video_id;
              dotstudiozPlayer.startRender(mergedPlayerOpts);
            }
          }
        }

    return (
      <span>
      {/* <div className="aniboxWrapper" style={{height: this.state.isAnimated ? "auto" : "0px"}}><div className="playerAniBox" style={this.state.aniBoxStyle} ref="playerAniBox"></div></div> */}
      <PlayerAniBox boxParams={this.state.aniBoxParams} />
      <div className="playerOuterWrapper" ref="playerOuterWrapper">
        <div className="playerInnerWrapper" ref="playerInnerWrapper" style={wrapperStyle}>
          <div className="playerContainerSpacer" ref="playerContainerSpacer">
            <PlaceHolder size="160x90" />
          </div>
          <div className={this.state.playerClass} style={this.state.playerTopStyle} ref="playerContainer">
            <div key="dspPlayerComponent" className="player-area">
              {script}
              <div className="player-container">
                <div className="intrinsic-container intrinsic-container-16x9">
                  <div id="player" className="player" /></div>
              </div>
            </div>
        </div>
      </div>
    </div>
  </span>
    );
  }
}
