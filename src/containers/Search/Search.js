import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { search, resetSearchGrid } from 'redux/modules/search';
import ColorDiv from '../../components/ColorDiv/ColorDiv';
import SearchGrid from '../../components/Grid/SearchGrid';
import SearchList from '../../components/SearchList/SearchList';

@connect(state => ({
    videos: state.search.videos,
    articles: state.search.articles
  }), { search, resetSearchGrid })

export default class Search extends Component {
  static propTypes = {
    search: PropTypes.func.isRequired,
    resetSearchGrid: PropTypes.func.isRequired,
    location: PropTypes.object,
    videos: PropTypes.array,
    articles: PropTypes.array,
    params: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      smallScreen: false,
      isSearching: false,
      isAtLeastTwoChars: false
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize, {passive: true});
    window.addEventListener("load", this.handleResize, {passive: true});
    this.handleResize();
  }

  // min 2 characters required for us to fire off AJAX
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.params.query !== this.props.params.query && this.props.params.query.length >= 2) {
      this.props.search(this.props.params.query);
    }
  }

  componentWillUnmount() {
    this.props.resetSearchGrid();
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("load", this.handleResize);
  }

  handleResize = (event) => {
    this.setState({
      smallScreen: window.innerWidth <= 1100
    });
  }

  handleSearchInput(query) {
    if (query.length === 0) {
      this.setState({
        isSearching: false,
        isAtLeastTwoChars: false,
      });
    } else {
      this.setState({
        isSearching: true
      });
      if (query.length >= 2) {
        this.setState({
          isAtLeastTwoChars: true
        });
      }
    }
  }

  render() {
    const styles = require("./Search.less");

    const { videos, articles } = this.props;
    let result = null;

    if (videos.length !== undefined && (videos.length > 0 || articles.length > 0)) {
      // videos and articles have quite different taxonomy, so format the grids differently for them
      const formattedVideos = [];
      videos.map((video, index) => {
        formattedVideos.push({
          id: video._id,
          title: video._source.title,
          thumb: "https://image.dotstudiopro.com/" + video._source.thumb
        });
      });

      const formattedArticles = [];
      articles.map((article, index) => {
        let linkTo = "/";
        let categoryName = "";
        if (article.post_type !== 'contestant' && article.post_type !== 'host' && article.post_type !== 'judge' && article.post_type !== 'teammate') {
          if (article.post_type === 'host') {
            linkTo = linkTo + article.post_type + "/" + article.post_name;
          } else if (article.taxonomy === null) {
            linkTo = linkTo + article.post_type + "s/" + "uncategorized/" + article.post_name;
          } else {
            categoryName = article.taxonomy[0].name;
            linkTo = linkTo + article.post_type + "s/" + article.taxonomy[0].slug + "/" + article.post_name;
          }
          formattedArticles.push({
            id: article.ID.toString(),
            title: article.post_title,
            thumb: article.thumb,
            linkTo: linkTo,
            categoryName: categoryName,
            excerpt: article.post_excerpt,
            type: article.post_type
          });
        }
      });
      if (!this.state.smallScreen) {
        result = (
          <div>
            <SearchGrid gridTitle={"Matching Articles"} results={formattedArticles} resultType="article"/>
            <SearchGrid gridTitle={"Matching Videos"} results={formattedVideos} resultType="video"/>
          </div>
        );
      } else {
        result = (
          <div className="search-list-block">
            <SearchList listTitle={"Matching Articles"} results={formattedArticles} resultType="article"/>
            <SearchList listTitle={"Matching Videos"} results={formattedVideos} resultType="video"/>
          </div>
        );
      }
    } else {
      if (this.props.params.query.length >= 2) {
        result = (
          <div className="searchNotify">
            <h2>Sorry, didn't find anything matching your search.</h2>
          </div>
        );
      } else {
        result = (
          <div className="searchNotify">
            <h2>Please enter a search term, at least two characters in length.</h2>
          </div>
        );
      }
    }

    return (
      <div className="search">
        <Helmet title="Search Results"/>
        {result}
      </div>
    );
  }
}
