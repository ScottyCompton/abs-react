import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Footer from '../../components/Footer/Footer';
import Helmet from 'react-helmet';
import Header from '../../components/Header/Header';
import { browserHistory } from 'react-router';
import { isLoaded as isApiAccessLoaded, load as loadApiAccess } from 'redux/modules/apiAccess';
import { push } from 'react-router-redux';
import config from '../../config';
import { asyncConnect } from 'redux-connect';
import theme from 'theme/theme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import BlogSearchBox from '../../components/BlogSearchBox/BlogSearchBox';
import ReactLoader from 'react-loader';

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {
    const promises = [];

    if (!isApiAccessLoaded(getState())) {
      promises.push(dispatch(loadApiAccess()));
    }

    return Promise.all(promises);
  }
}])

@connect(state => ({}), {})

export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    location: PropTypes.object
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      showSmallScreenHeader: false,
      showLargeScreenHeader: false,
      showBigSpacer: false,
      loaded: false,
    };
    this.handleScrollResize = this.handleScrollResize.bind(this);
  }

  componentWillMount() {
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleScrollResize, {passive: true});
    window.addEventListener("scroll", this.handleScrollResize, {passive: true});
    window.addEventListener("load", this.showHideFooterPadding, {passive: true});
     browserHistory.listen( location =>  {
       this.handleScrollResize();
      });
      this.handleScrollResize();
      this.showLoadedContent();
    }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleScrollResize);
    window.removeEventListener("scroll", this.handleScrollResize);
    window.removeEventListener("load", this.showHideFooterPadding);
  }

  getShowOrHideLargeScreenHeader() {
    return window.innerWidth > 1100;
  }

  getShowOrHideSmallScreenHeader() {
    return window.innerWidth <= 1100;
  }

  handleScrollResize = (event) => {
    this.setState({
      showSmallScreenHeader: this.getShowOrHideSmallScreenHeader(),
      showLargeScreenHeader: this.getShowOrHideLargeScreenHeader(),
      showBigSpacer: this.getShowOrHideLargeScreenHeader() && (location.pathname !== '/')
    });
  }

  showLoadedContent() {
    setTimeout(function() {
      this.setState({
        loaded: true,
      });
    }.bind(this), 500);
  }

  render() {
    let searchBox = null;
    const styles = require('./App.less');
    const { location } = this.props;
    if (location) {
        if (location.pathname.indexOf("search") > 0) {
          searchBox = <BlogSearchBox/>;
        }
    }


    return (
      <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
        <div className="app nopadding ">
          <Helmet {...config.app.head} />
          <ReactLoader loaded={this.state.loaded || location.pathname !== '/'}>
            <Header location={location} showSmallScreenHeader={this.state.showSmallScreenHeader} showLargeScreenHeader={this.state.showLargeScreenHeader}/>
            { searchBox }
            <div className="big-ol-container" style={{minHeight: "100vh"}}>
              {this.props.children}
              <Footer location={location} />
            </div>
            <div id="fb-root"></div>
          </ReactLoader>
        </div>
      </MuiThemeProvider>
    );
  }
}
