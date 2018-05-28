import React from 'react';
import { PropTypes } from 'prop-types';
import GridItem from './SearchGridItem';
const styles = require('./SearchGridStyle.less');


export default class SearchGrid extends React.Component {
  static propTypes = {
    gridTitle: PropTypes.string.isRequired,
    results: PropTypes.array.isRequired,
    resultType: PropTypes.string.isRequired
  };

  toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

  render() {
    const { results, gridTitle, resultType } = this.props;
    let result = <span></span>;
    let SearchGridItems = [];
    let articleGridItems = [];
    let articleResults = [];
    let typesNames = [];
    let types = [];
    let filteredTypes = [];

    if (results && results.length > 0) {
        results.map((item, index) => {
          SearchGridItems.push(
            <GridItem resultType={resultType} key={index + 1} {...item} />
          );
        });
      // }
    }

      result = (
        <div className="searchGridWrapper">
          <h1 className="searchCategory" key="0">{gridTitle}</h1>
          <div className="searchContainer">
            {/* articleResults.length > 0 ? articleResults : SearchGridItems */}
            {SearchGridItems}
          </div>
        </div>
      );
    return result;
  }
}
