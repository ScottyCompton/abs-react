import React, { Component } from 'react';
import { PropTypes } from 'prop-types';


export default class ColorDiv extends Component {

  static propTypes = {
    ColorsToDisplay: PropTypes.array.isRequired,
    LineHeight: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }


  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    let colorDivs = [];
    let lineHeight = this.props && this.props.LineHeight ? this.props.LineHeight : "1.5vh";
    if (this.props.ColorsToDisplay && this.props.ColorsToDisplay.length > 0) {
      for (let i=0; i < this.props.ColorsToDisplay.length; i++) {
        colorDivs.push(
          <div key={i} className="colorDiv" style={{backgroundColor: this.props.ColorsToDisplay[i], height: lineHeight}}></div>
        );
      }
    }
      return (
      <div className="colorDivGroup">
        {colorDivs}
      </div>
    );
  }
}
