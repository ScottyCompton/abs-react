import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import ColorDiv from '../../components/ColorDiv/ColorDiv';
import config from '../../config';
import { Link } from 'react-router';
import PlaceHolder from '../../components/DynamicPlaceHolder/DynamicPlaceHolder';
import { load as loadArchiveByType } from 'redux/modules/archive';

@connect(state => ({
  items: state.archive.items,
  loaded: state.archive.loaded,
  loading: state.archive.loading,
  error: state.archive.error,
}), { loadArchiveByType })

export default class Archive extends Component {
  static propTypes = {
    loadArchiveByType: PropTypes.func.isRequired,
    route: PropTypes.object.isRequired,
    items: PropTypes.array,
    loaded: PropTypes.bool,
    loading: PropTypes.bool,
    error: PropTypes.object,
    params: PropTypes.object,
    location: PropTypes.object
  };

  componentWillMount() {
    this.props.loadArchiveByType(this.props.route.postType);
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.route.postType !== this.props.route.postType) {
      this.props.loadArchiveByType(nextProps.route.postType);
    }
  }

  componentDidUpdate() {
    window.location.hash = window.decodeURIComponent(window.location.hash);
    const scrollToAnchor = () => {
      const hashParts = window.location.hash.split('#');
      if (hashParts.length >= 2) {
        const hash = hashParts.slice(-1)[0];
        const elem = document.getElementById(`${hash}`);
        if (elem) {
          elem.style.top = '-200px';
          elem.scrollIntoView();
        }
      }
    };
    scrollToAnchor();
    window.onhashchange = scrollToAnchor;
  }

  componentWillUnmount() {
  }

  stripHTML(theVal) {
    let rex = /(<([^>]+)>)/ig;
    return (
      theVal.replace(rex, "")
    );
  }

  formatDate(dte) {
    let arrDteTime = dte.split(" ");
    let arrDate = arrDteTime[0].split("-");
    let m = arrDate[1].substring(0, 1) === "0" ? arrDate[1].substr(1, 1) : arrDate[1];
    let d = arrDate[2].substring(0, 1) === "0" ? arrDate[2].substr(1, 1) : arrDate[2];
    return (m + "/" + d + "/" + arrDate[0]);
  }

  render() {
    const { items } = this.props;
    const pageTitle = this.props.route.postType.charAt(0).toUpperCase() + this.props.route.postType.slice(1) + "s";
    const itemCards = [];
    const categories = [];
    const filteredCategories = [];
    const categoryNames = [];

    // Get everything together before we start building cards.
    items.map((item, index) => {
      const imageUrl = item.thumb ? item.thumb : "";
      let theDate = new Date(item.post_date);
      let category = item.taxonomy && item.taxonomy[0] && item.taxonomy[0].slug ? item.taxonomy[0].slug : "uncategorized";
      let categoryName = item.taxonomy && item.taxonomy[0] && item.taxonomy[0].name ? item.taxonomy[0].name : "Uncategorized";
      categoryNames.push(categoryName);
      if (!categories[categoryName]) categories[categoryName] = [];
      let theLink = ("/" + item.post_type + (item.post_type === "sweepstakes" ? "" : "/" + category) + "/" + item.post_name).replace("/tutorial/", "/tutorials/").replace("/article/", "/articles/").replace("/look/", "/looks/");
      // let postDate = theDate.getDay().toString() + '/' + theDate.getMonth().toString() + '/' + theDate.getFullYear().toString();
      let postDate = this.formatDate(item.post_date);
      let postExcerpt = item.meta && item.meta.dspabs_blurb && item.meta.dspabs_blurb[0] ? item.meta.dspabs_blurb[0] : "";
      if (postExcerpt.length === 0) {
        postExcerpt = item.post_content;
      }
      const postType = item.post_type;
      postExcerpt = this.stripHTML(postExcerpt).substring(0, 300);

      categories[categoryName].push({imageUrl, postDate, theLink, post_title: item.post_title, pageTitle, categoryName, postExcerpt, postType});
    });

    categoryNames.sort();

    // After we sort the category names, we can use that sort to get everything in order.
    categoryNames.map((cat, ind) => {
      filteredCategories[cat] = categories[cat];
    });

    // Build the cards
    Object.keys(filteredCategories).map((cat, index) => {
      const category = cat;
      let cards = [];
      categories[cat].map((val, ind) => {
        cards.push(
          <div className="archiveItem" key={index+ind}>
            <div className="row nopadding hidden-lg">
              <div className="col-xs-12 nopadding">
                <div className="post-date pull-right">{val.postDate}</div>
              </div>
            </div>
            <div className="row nopadding">
              <div className="col-xs-3 nopadding">
                <div className="post-img">
                  {val.imageUrl !== "" ? <img src={val.imageUrl} className="img img-fluid" /> : <PlaceHolder size="400x439" />}
                </div>
              </div>
              <div className="col-xs-9 nopadding">
                <div className="row nopadding hidden-sm hidden-xs hidden-md">
                  <div className="col-xs-12 nopadding">
                    <div className="post-date">{val.postDate}</div>
                  </div>
                </div>
                <div className="row nopadding">
                  <div className="col-xs-12 nopadding">
                    <div className="post-title"><h4><Link to={val.theLink}>{val.post_title}</Link></h4></div>
                  </div>
                </div>
                <div className="row nopadding">
                  <div className="col-xs-12 nopadding">
                    <div className="post-catgory-link">{val.pageTitle + (val.postType === 'sweepstakes' ? "" : "/" + val.categoryName)}</div>
                  </div>
                </div>
                <div className="row nopadding">
                  <div className="col-xs-12 nopadding">
                    <div className="post-catgory-excerpt" dangerouslySetInnerHTML={{ __html: val.postExcerpt }} />
                  </div>
                </div>
                <div className="row nopadding">
                  <div className="col-xs-12 nopadding">
                    <div className="post-readmore pull-right"><span className="arrow-continue">&#11162;</span> <Link to={val.theLink}>Continue reading</Link></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row nopadding">
              <div className="col-xs-12 nopadding">
                <div className="post-lower-border"></div>
              </div>
            </div>
          </div>
        );
      });
      itemCards.push(
          <div className="archiveCategory" key={index+cat}>
            <a className={"archiveCategoryName hash"} href={"#"} id={cat}></a>
            {cards}
          </div>
        );
    });
    return (
      <div className="archive">
        <Helmet title={pageTitle}/>
        <div className="archiveList">
          <div className="page-title">
            <h1>{pageTitle}</h1>
          </div>
          {itemCards}
        </div>
      </div>
    );
  }
}
