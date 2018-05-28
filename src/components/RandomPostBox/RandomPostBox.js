import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getRandom, clearRandom } from 'redux/modules/randomPosts';
import PlaceHolder from '../../components/DynamicPlaceHolder/DynamicPlaceHolder';

@connect(state => ({
    token: state.apiAccess.token,
    items: state.randomPosts.items,
    loading: state.randomPosts.loading,
    loaded: state.randomPosts.loaded,
    error: state.randomPosts.error
  }), { getRandom, clearRandom }
)

export default class RandomPostBox extends Component {
  static propTypes = {
    articleType: PropTypes.string.isRequired,
    getRandom: PropTypes.func.isRequired,
    clearRandom: PropTypes.func.isRequired,
    items: PropTypes.array,
    loading: PropTypes.bool,
    loaded: PropTypes.bool,
    error: PropTypes.object
  };

  componentWillMount() {

  }

  componentDidMount() {
    const { articleType } = this.props;
    this.props.getRandom(articleType);
  }

  componentWillUnmount() {
    this.props.clearRandom();
  }

  render() {
    const { items, articleType } = this.props;
    const styles = require('./RandomPostBox.less');
    // Iterate over channels making a single slide/card out of each one
    const Posts = [];
    // console.clear();
    if (items && items.length) {
      items.map((item, index) => {
        // console.log(item);
        let taxonomy = item.taxonomy || {};
        let category = taxonomy.slug || "uncategorized";
        let featuredImage =  item.featured_image && item.featured_image.url ? item.featured_image.url : "";
        Posts.push(
          <div className="randomPost" key={index+1}>
            <div className="thumb" style={{backgroundImage: "url(" + featuredImage + ")"}}>
              <Link to={"/" + item.post_type + "s/" + category + "/" + item.post_name}>
              <PlaceHolder size="200x300" />
            </Link>
              <div className="meta">
                <Link to={"/" + item.post_type + "s/" + category + "/" + item.post_name}><h1>{item.post_title}</h1></Link>
              </div>
            </div>
          </div>
        );
      });
    } else {
      Posts.push(<div key="0"></div>);
    }

    // render method
    return (
      <div className="randomPostContainer">
        <h3><Link to={"/" + this.props.articleType + "s"}>More {this.props.articleType}s</Link></h3>
        <div className="randomPostBox">
          { Posts }
        </div>
      </div>
    );
  }
}
