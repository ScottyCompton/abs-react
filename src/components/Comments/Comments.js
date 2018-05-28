import React from 'react';
import { PropTypes } from 'prop-types';

export default class Comments extends React.Component {
  static propTypes = {
    shareURL: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (FB) FB.XFBML.parse();
  }

  render() {
    const { shareURL } = this.props;
    return (
      <div
        className="fb-comments"
        data-colorscheme="dark"
        data-width="100%"
        data-href={shareURL}
        data-numposts="10"
      ></div>
    );
  }
}
