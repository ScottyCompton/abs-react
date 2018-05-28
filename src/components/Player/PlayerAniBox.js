import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { browserHistory, connect } from 'react-redux';
import ReactGA from 'react-ga';
import config from '../../config';
import { findDOMNode } from 'react-dom';

export default class PlayerAniBox extends Component {
  static propTypes = {
    boxParams: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
        aniBoxStyle: {
          width: this.props.boxParams.initialWidth,
          height: this.props.boxParams.initialHeight,
          left: this.props.boxParams.initialLeft,
          top: this.props.boxParams.initialTop,
          position: this.props.boxParams.position
        },
        isAnimated: false
      };
    this.doAnimation = this.doAnimation.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const initialVal = this.props && this.props.boxParams && this.props.boxParams.finalClass && this.props.boxParams.finalClass !== undefined ? this.props.boxParams.finalClass : "";
    const finalVal = newProps && newProps.boxParams && newProps.boxParams.finalClass && newProps.boxParams.finalClass !== undefined ? newProps.boxParams.finalClass : "";
    if ((initialVal !== finalVal) && !this.state.isAnimated) {
      // console.log('INITIAL PROPERTIES: ', this.props.boxParams);
      // console.log('NEW PROPERTIES: ', newProps.boxParams);
      this.doAnimation(newProps.boxParams);
    }
  }

  doAnimation(params) {
        let aniBox = this.refs.playerAniBox;
        this.setState({
            isAnimated: true,
        });
        let aniBoxStyle = {
            width: params.initialWidth,
            height: params.initialHeight,
            left: params.initialLeft,
            top: params.initialTop,
            position: params.position
        };
        this.setState({
            aniBoxStyle: aniBoxStyle
        });
        aniBoxStyle = {
            width: params.finalWidth,
            height: params.finalHeight,
            left: params.finalLeft,
            top: params.finalTop,
            position: params.position
        };
        this.setState({
            aniBoxStyle: aniBoxStyle
        });
        // hide the box
        aniBoxStyle = {
            height: "0px",
            width: "0px"
        };

        setTimeout(function() {
            this.setState({
                aniBoxStyle: aniBoxStyle,
                isAnimated: false,
            });
        }.bind(this), 550);
  }

  render() {
    return (
      <div className="aniboxWrapper" style={{height: this.state.isAnimated ? "auto" : "0px"}}>
        <div className={this.state.isAnimated ? "playerAniBox isAnimated" : "playerAniBox"} style={this.state.aniBoxStyle} ref="playerAniBox"></div>
      </div>
    );
  }

}
