import React, { Component } from 'react';
import {findDOMNode} from 'react-dom';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PlaceHolder from '../../components/DynamicPlaceHolder/DynamicPlaceHolder';
import ReactTooltip from 'react-tooltip';

export default class CastMember extends Component {
  static propTypes = {
    detail: PropTypes.object,
    canvasWidth: PropTypes.number,
    canvasHeight: PropTypes.number,
    showNow: PropTypes.bool,
  }

constructor(props) {
  super(props);

  const {detail} = props;
  let l = detail.dspabs_castmember_canvas_x + "%";
  let t = detail.dspabs_castmember_canvas_y + "%";
  let h = ((detail.dspabs_castmember_pct_height/100) * this.props.canvasHeight) + "px";
  let w = ((detail.dspabs_castmember_pct_height/100) * this.props.canvasHeight * this.props.detail.dspabs_castmember_img_aspect_ratio) + "px";
  let z = detail.dspabs_castmember_canvas_z * 10;
  this.state = {
    castMemberStyle: {
      left: l,
      top: t,
      height: h,
      width: w,
      zIndex: z
    },
    castMemberClassName: "castMember introToStage"
  };

  this.handleResize = this.handleResize.bind(this);
  this.handleMouseOver = this.handleMouseOver.bind(this);
  this.handleMouseOut = this.handleMouseOut.bind(this);
}

  componentWillReceiveProps(newProps) {
    let initialValue = this.props && this.props.canvasWidth;
    let finalValue = newProps && newProps.canvasWidth;
    if (finalValue !== initialValue) {
      this.handleResize(newProps);
    }
    if (newProps.showNow !== this.props.showNow) {
      this.setState({
        castMemberClassName: this.props.detail.dspabs_castmember_active ? "castMember activeCastMember" :  "castMember inactiveCastMember"
      });
    }
  }

  handleResize(newProps) {
    this.setState({
      castMemberStyle: {
        left: newProps.detail.dspabs_castmember_canvas_x + "%",
        top: newProps.detail.dspabs_castmember_canvas_y + "%",
        height: ((newProps.detail.dspabs_castmember_pct_height/100) * newProps.canvasHeight) + "px",
        width: ((newProps.detail.dspabs_castmember_pct_height/100) * newProps.canvasHeight * newProps.detail.dspabs_castmember_img_aspect_ratio) + "px",
        zIndex: newProps.detail.dspabs_castmember_canvas_z * 10
      }
    });
  }

  handleMouseOver() {
    this.setState({
      castMemberReturnStyle: this.state.castMemberStyle,
      castMemberClassName: "castMember hoverState",
      castMemberStyle: {
        height: (this.state.castMemberStyle.height.replace('px', '') * 1.1) + 'px',
        width: (this.state.castMemberStyle.width.replace('px', '') * 1.1) + 'px',
        left: this.state.castMemberStyle.left,
        top: this.state.castMemberStyle.top,
        zIndex: 40
      }
    });
  }

  handleMouseOut(e) {
    let isActive = this.props.detail.dspabs_castmember_active;
    this.setState({
      castMemberStyle: this.state.castMemberReturnStyle
    });
    setTimeout(function() {
      this.setState({
        castMemberClassName: isActive ? "castMember activeCastMember" :  "castMember inactiveCastMember"
      });
    }.bind(this), 500);
  }

  render() {
    const {detail, canvasWidth, canvasHeight} = this.props;
    const t = true;
      let active = detail && detail.dspabs_castmember_active ? detail.dspabs_castmember_active : false;
      let canvasX = detail && detail.dspabs_castmember_canvas_x ? detail.dspabs_castmember_canvas_x : 0;
      let canvasY = detail && detail.dspabs_castmember_canvas_y ? detail.dspabs_castmember_canvas_y : 0;
      let canvasZ = detail && detail.dspabs_castmember_canvas_z ? detail.dspabs_castmember_canvas_z : 0;
      let id = detail && detail.dspabs_castmember_id ? detail.dspabs_castmember_id : null;
      let imgAspectRatio = detail && detail.dspabs_castmember_img_aspect_ratio ? detail.dspabs_castmember_img_aspect_ratio : 1;
      let imgURL = detail && detail.dspabs_castmember_img_url ? detail.dspabs_castmember_img_url : "";
      let castMemberName = detail && detail.dspabs_castmember_name ? detail.dspabs_castmember_name : "";
      let pctHeight = detail && detail.dspabs_castmember_pct_height ? detail.dspabs_castmember_pct_height : 60;
      let castMemberURL = detail && detail.dspabs_castmember_url ? detail.dspabs_castmember_url : "";
      let toolTipTitle = detail && detail.dspabs_castmember_tooltip_title ? detail.dspabs_castmember_tooltip_title : castMemberName;
      let toolTipContent = detail && detail.dspabs_castmember_tooltip_content ? detail.dspabs_castmember_tooltip_content : "";
      let placeHolderSize = (imgAspectRatio * 100) + "x100";
      let toolTipPlacement = 0;
      let toolTipOffset = {};

      let toolTipStyle = {
        width: (canvasWidth * 0.15) + "px"
      };

      if (canvasX >= 51) {
        toolTipPlacement = "left";
        toolTipOffset = {
          top: 30,
          left: 30,
        };
      } else {
        toolTipPlacement = "right";
        toolTipOffset = {
          top: 30,
          right: 30
        };
      }

    return (
      <div className="castMemberContainer">
        <div className={this.state.castMemberClassName} style={this.state.castMemberStyle} ref="castMember">
          <Link data-tip data-for={"castMemberToolTip_" + id} to={castMemberURL} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
            <img src={imgURL} className="img img-fluid" />
          </Link>
        </div>
        <ReactTooltip id={"castMemberToolTip_" + id} place={toolTipPlacement} offset={toolTipOffset}>
          <div className="tooltipContent" style={toolTipStyle}>
            <h4>{toolTipTitle}</h4>
            {toolTipContent}
          </div>
        </ReactTooltip>
      </div>
    );
  }
}
