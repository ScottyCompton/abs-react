import React from 'react';
import { PropTypes } from 'prop-types';
import {Link} from 'react-router';
import PlaceHolder from '../../components/DynamicPlaceHolder/DynamicPlaceHolder';
const styles = require('./SearchList.less');


export default class SearchList extends React.Component {
  static propTypes = {
    listTitle: PropTypes.string.isRequired,
    results: PropTypes.array.isRequired,
    resultType: PropTypes.string.isRequired
  };

  toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

  searchListItem(item, idx) {
    if (item === null) {
      return (<span></span>);
    } else {
      let id = item.id;
      let linkTo = item.linkTo;
      let thumb = item.thumb;
      let title = item.title;
      let type = this.toTitleCase(item.type || "");
      let resultType = this.props.resultType;
      let excerpt = item.excerpt;
      let posterImage = (thumb !== null) ? thumb : "https://d1bud3tr8474k6.cloudfront.net/wp-content/uploads/2017/07/17160507/abs-search-noimg.jpg";
      let url = "";
      if (resultType === "video") {
        url = "/video/" + id;
      } else {
        url = linkTo;
      }
      const spacerType = resultType === "video" ? <PlaceHolder size="160x90" /> : <PlaceHolder size="50x75" />;
      return (
        <li><Link to={url}>
          <div className="searchlist-item-poster" style={{backgroundImage: "url(" + posterImage + ")"}}>{spacerType}</div>
          <div className="searchlist-item-text">
              <div className="searchlist-item-title">
                <h3>{title}</h3>
                <h4>{excerpt}</h4>
              </div>
          </div>
        </Link>
        </li>
      );
    }
  }

  render() {
    const { results, listTitle, resultType } = this.props;
    let ListItems = [];

    if (results && results.length > 0) {
      Object.keys(results).map((key, idx) => {
          ListItems.push(
            this.searchListItem(results[key], idx)
          );
        });
      } else {
        ListItems.push(
          this.searchListItem(null, null)
        );
      }
    if (results && results.length !== 0) {
      return (
        <div className="search-list-results">
          <div className="search-list">
            <h2 className="search-list-title">{listTitle}</h2>
            <ul>
              {ListItems}
            </ul>
          </div>
        </div>
      );
    } else {
      return (<span></span>);
    }
  }
}
