import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
/* Actions */
import { loadGridChannels } from 'redux/modules/grid';
/* Component */
import GridItem from '../../components/SearchGrid/SearchGridItem';
import Util from '../../helpers/Util';

// connect to the store so we can get/retrieve token
@connect(state => ({
    countryCode: state.apiAccess.countryCode,
    channels: state.grid.channels,
    error: state.grid.error,
    loaded: state.grid.loaded,
    token: state.apiAccess.token
  }), { loadGridChannels }
)

export default class Grid extends React.Component {
  static propTypes = {
    loadGridChannels: PropTypes.func.isRequired,
    token: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired,
    countryCode: PropTypes.string.isRequired,
    channels: PropTypes.array,
    loaded: PropTypes.bool,
    error: PropTypes.object
  };

  // fired when component is about to re-/render in the virtual DOM
  componentDidMount() {
    const { token, countryCode } = this.props;
    this.props.loadGridChannels(token, countryCode, this.props.params.category);
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem('returnFromSearch');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.category !== this.props.params.category) {
      const { token, countryCode } = this.props;
      this.props.loadGridChannels(token, countryCode, nextProps.params.category);
    }
  }

  componentWillUnmount() {
    // this.props.cleanGridChannels();
  }

  render() {
    Util.redirectIfFirstTimeVisitor();

    const style = require('./style.less');
    const { channels, token } = this.props;
    const { category } = this.props.params;
    let catName = category.replace(/-/g, ' ');
    let gridItems = [];
    if (channels && channels.length > 0) {
      channels.map((channel, index) => {
        const posterURL = channel.spotlight_poster ? channel.spotlight_poster : channel.poster;
        gridItems.push(
          <GridItem
            key={index}
            _type="channel"
            _source={channel}
            _id={channel._id}
            spotlight_poster={posterURL}
            slug={channel.slug}
          />);
      });
    } else {
      gridItems = (<div className="noResults"><h1>Sorry, there's nothing in this category.</h1></div>); // TODO: possibly redirect to 404?
    }

    return (
      <div>
        <div className="searchContainer">
          <div className="catName">Browse > <h1 className="catName2">{ catName }</h1></div>
          { gridItems }

        </div>
      </div>
    );
  }
}
