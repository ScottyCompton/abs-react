import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import Script from 'react-load-script';

export default class KlugyScript extends Component {

  static propTypes = {
  };

  constructor() {
    super();
    this.state = {
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    const scripts = document.querySelectorAll('showpage_hype_container');
    if (scripts && scripts.forEach) {
        scripts.forEach((elem) => {
            elem.parentNode.removeChild(elem);
        });
    }
  }

  handleScriptError(e) {
    console.log("Script errorred: ", e);
  }

  handleScriptLoad() {
    console.log("It Loaded");
  }

  render() {
    const klugy = <Script url={"https://s3-us-west-1.amazonaws.com/ambeautystars/show_page/show_page.hyperesources/showpage_hype_generated_script.js"} onError = {this.handleScriptError.bind(this)} onLoad = {this.handleScriptLoad.bind(this)} />;
    return (
      <div id="showpage_hype_container" className="showpage_hype_container">
        {klugy}
      </div>
    );
  }
}
