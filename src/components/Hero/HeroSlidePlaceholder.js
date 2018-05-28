import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

export default class HeroSlidePlaceholder extends Component {
  static propTypes = {
    preloadText: PropTypes.string,
    slideWidth: PropTypes.string,
    slideHeight: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    const {slideWidth, slideHeight} = this.props;
    return (
      <div className="hero-timeline-wrapper">
        <div className="hero-timeline-item" style={{ width: slideWidth, height: slideHeight }}>
          <div className="hero-animated-background"></div>
        </div>
      </div>
    );
  }
}
