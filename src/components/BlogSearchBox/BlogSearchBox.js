import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { resetSearchGrid } from 'redux/modules/search';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // React Transitions API
import SearchIcon from 'material-ui/svg-icons/action/search';
import TextField from 'material-ui/TextField';

@connect( state => ({
    reset: state.search.reset
  }), { resetSearchGrid })

export default class BlogSearchBox extends Component {
  static propTypes = {
    resetSearchGrid: PropTypes.func.isRequired,
    reset: PropTypes.bool.isRequired,
    locationBack: PropTypes.string,
  };

  constructor() {
    super();

    this.state = {
      expand: false, // To show/hide the input field
      searchVal: '', // Search query
      showClear: false,
      searchBoxWidth: {width: "100px"}
    };
  }


  componentWillReceiveProps(newProps) {
    if (newProps.reset) {
      this.clearSearchBarOnly();
    }
  }

  // Toggles the input field when we click on the search icon
  toggleSearchBar() {
    this.setState({
      expand: !this.state.expand
    });

    if (typeof window !== 'undefined') {
      // If we have chosen to hide the input field and there's no input, go back to home
      if (!this.state.expand && this.state.searchVal === 0) {
        // browserHistory.push('/get-the-look');
        if (localStorage !== undefined) {
          browserHistory.push(localStorage.getItem('locationBack'));
        }
      }
    }
  }

  // If we have at least 2 letters in the search bar, we can perform a search
  doSearch(event) {
    this.setState({
      searchVal: event.target.value
    });
    if (event.target.value.length > 0) {
      this.setState({
        showClear: true
      });
      if (typeof window !== 'undefined') {
        browserHistory.push('/search/' + event.target.value);
      }
    } else {
      this.setState({
        showClear: false,
        expand: true
      });

      this.props.resetSearchGrid();
      if (typeof window !== 'undefined') {
        // browserHistory.push('/get-the-look');
        browserHistory.push('/search/%20');
      }
    }
  }

  // Pressing the X does a full reset of the search bar, results, and locattion
  clearSearchResults() {
    this.setState({
      expand: false,
      searchVal: ' ',
      showClear: false
    });

    this.props.resetSearchGrid();
    if (typeof window !== 'undefined') {
      // browserHistory.push('/get-the-look');
      browserHistory.push('/search/%20');
    }
  }

  clearSearchBarOnly() {
    this.setState({
      expand: false,
      searchVal: '',
      showClear: false
    });
  }

  render() {
    const styles = {
      searchIcon: {
        transform: 'translateY(10px)',
        marginRight: '10px',
        marginLeft: '20px',
        fontSize: '3vh',
        color: '#000000',
        width: '36px',
        height: '36px'
      },
      clearIcon: {
        transform: 'translateY(10px)',
        position: 'absolute',
        color: '#000',
        right: '0px'
      },
      underlineStyle: {
        borderColor: 'white',
        color: '#000',
        border: 'none',
      },
      hintStyle: {
        color: '#c0c0c0',
      },
    };

    let textField = null;
    if (!this.state.expand) {
      textField =
        <TextField hintText="Search" className="doDaSearch" value={this.state.searchVal} style={{width: "auto"}} underlineShow={false} hintStyle={styles.hintStyle} underlineFocusStyle={styles.underlineStyle} onChange={this.doSearch.bind(this)}/>;
    }

    let clearElem = null;
    if (this.state.showClear) {
      clearElem = <ClearIcon style={styles.clearIcon} onClick={this.clearSearchResults.bind(this)}/>;
    }

    return (
      <div className="blogSearchBoxOuterWrapper">
        <div className="blogSearchBox">
          <div className="blogSearchBoxContainer">
          <SearchIcon className="search-button" style={styles.searchIcon} onClick={this.toggleSearchBar.bind(this)}/>
          <ReactCSSTransitionGroup transitionName="showSearch" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
            {textField}
          </ReactCSSTransitionGroup>
        </div>
        </div>
      </div>
    );
  }
}
