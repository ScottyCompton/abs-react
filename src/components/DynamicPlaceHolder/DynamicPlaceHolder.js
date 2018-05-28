import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

export default class DynamicPlaceHolder extends Component {
  static propTypes = {
    size: PropTypes.string,
    scale: PropTypes.bool,
    bgColor: PropTypes.string,
    className: PropTypes.string,
    alignDiv: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {size, bgColor} = this.props;
    let plcStyle = {};
    let WxH = size.split('x');
    let width = WxH[0];
    let height = WxH[1];
    let paddingBottom = ((height / width)*100) + '%';
    let noScaling = this.props.scale && this.props.scale === false;
    let backgroundColor = bgColor ? bgColor : "none";
    let align = this.props.alignDiv && this.props.alignDiv !== undefined ? divAlign : "";
    if (noScaling) {
      plcStyle = {
        width: width + 'px',
        height: height + 'px',
        backgroundColor: backgroundColor,
      };
    } else {
      plcStyle = {
        width: "100%",
        backgroundColor: backgroundColor,
      };
    }
    let addlClass = this.props.className !== undefined ? " " + this.props.className : "";
    let imgFluid = noScaling ? "" : " img img-fluid";
    let imgSrc= "data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' viewBox%3D'0 0 " + width + " " + height + "'%2F%3E";
    return (
      <div className={"placeHolder" + size + " " + addlClass} align={align}  style={plcStyle}><img src={imgSrc} width={width} height={height} className={"placeHolderImg" + size + imgFluid} /></div>
    );
  }
}
