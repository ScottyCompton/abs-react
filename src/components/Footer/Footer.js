import React from 'react';
import { IndexLink, Link } from 'react-router';
import { PropTypes } from 'prop-types';
import axios from 'axios';
import config from '../../config';
import { connect } from 'react-redux';
import Ad from '../Ad/Ad';
import PlaceHolder from '../../components/DynamicPlaceHolder/DynamicPlaceHolder';
import { subscribeEmailToMailchimp } from 'redux/modules/mailchimp';
import { load as loadFeaturedOptions } from 'redux/modules/featuredOptions';

@connect(state => ({
  options: state.featuredOptions.options,
  loaded: state.featuredOptions.loaded,
  loading: state.featuredOptions.loading,
  error: state.featuredOptions.error,
  mailchimpLoaded: state.mailchimp.loaded,
  mailchimpError: state.mailchimp.error,
  mailchimpResponse: state.mailchimp.response
}), { loadFeaturedOptions, subscribeEmailToMailchimp })


export default class Footer extends React.Component {

  static propTypes = {
    loadFeaturedOptions: PropTypes.func.isRequired,
    subscribeEmailToMailchimp: PropTypes.func.isRequired,
    mailchimpLoaded: PropTypes.bool,
    options: PropTypes.object,
    error: PropTypes.object,
    loaded: PropTypes.bool,
    mailchimpError: PropTypes.object,
    mailchimpResponse: PropTypes.object,
    location: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      smallScreen: window && window.innerWidth <= 1100 ? true : false,
      subscribeNotify: false,
      subscribeErrorNotify: false,
      loaded: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentWillMount() {
    if (this.props.error || !this.props.loaded) {
      this.props.loadFeaturedOptions();
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize, {passive: true});
    window.addEventListener("load", this.handleResize, {passive: true});
    this.showLoadedContent();
  }

  componentWillReceiveProps(nextProps) {
    const { mailchimpResponse } = this.props;
      if (mailchimpResponse !== nextProps.mailchimpResponse) {
      if (nextProps.mailchimpResponse.status && nextProps.mailchimpResponse.status === 400) {
        if (!this.state.subscribeErrorNotify) {
          this.setState(() => {
            return  {
              subscribeErrorNotify: true
            };
          });
          alert("There was an error subscribing you.  Have you already subscribed?  If not, please contact us.");
        }
      } else {
        if (!this.state.subscribeNotify) {
          this.setState(() => {
            return  {
              subscribeNotify: true,
              value: ''
            };
          });
          alert("Thank you! You are subscribed!");
        }
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("load", this.handleResize);
  }

  handleResize(event) {
    this.setState({smallScreen: window.innerWidth <= 1100});
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    if (event) event.preventDefault();
    let emailInput = document.querySelector('.enterEmail');
    let theVal = emailInput ? emailInput.value : "";
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(theVal)) {
      alert('Please enter a valid e-mail address to subscribe');
    } else {
      this.setState(() => {
        return  {
          subscribeErrorNotify: false,
          subscribeNotify: false
        };
      });
      this.props.subscribeEmailToMailchimp(this.state.value);
    }
  }

  handleFocus(event) {
    let obj = event.target;
    obj.placeholder = '';
  }

  handleBlur(event) {
    let obj = event.target;
    if (obj.value === '') {
      obj.placeholder = 'you@youremail.com';
    }
  }
  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.handleSubmit();
    }
  }

  showLoadedContent() {
    setTimeout(function() {
      this.setState({
        loaded: true,
      });
    }.bind(this), 2000);
  }

  render() {
    const { options, mailchimpResponse, location } = this.props;
    let footerMenu = {};

    if (options.menus) {
      let footer = options.menus.footer;
      footerMenu = footer.map((item, ind) => {
        let type = item.entry_type;
        if (!(this.state.smallScreen && item.url === "#")) {
          if (type === 'custom') {
            return <div key={ind} className="footerLink"><Link to={item.url}>{item.post_title}</Link></div>;
          } else if (type === 'post_type_archive') {
            let url = ['host', 'judge', 'contestant'].indexOf(item.post_type) > -1 ? "/show/" + item.post_type : "/" + item.post_type + "s";
            return <div className="footerLink" key={ind}><Link to={url}>{item.post_title}</Link></div>;
          } else {
            let url = ['host', 'judge', 'contestant'].indexOf(item.post_type) > -1 ? "/show/" + item.post_type + "/" + item.post_name : "/" + item.post_type + "s/" + item.post_name;
            return <div className="footerLink" key={ind}><Link to={url}>{item.post_title}</Link></div>;
          }
        }
      });
    } else {
      footerMenu = "";
    }

    const smallScreenSignupContainer = (
      <div className="signupContainer">
        <div className=" row nopadding">
          <div className="col-xs-12 nopadding">
            <div className="signupText">SUBSCRIBE TO OUR NEWSLETTER</div>
          </div>
        </div>
        <div className=" row nopadding">
          <div className="col-xs-12 nopadding">
            <input value={this.state.value} onChange={this.handleChange} onKeyPress={this.handleKeyPress} type="text" name="email" className="enterEmail"></input>
          </div>
        </div>
        <div className=" row nopadding">
          <div className="col-xs-12 nopadding">
            <div className="footerSubmit">
              <button onClick={this.handleSubmit}>SIGN UP</button>
            </div>
          </div>
        </div>
      </div>
    );

    const largeScreenSignupContainer = (
      <span>
      <div className="signupContainer">
        <div className="signup-container-msg">
          <img src="https://d1bud3tr8474k6.cloudfront.net/wp-content/uploads/2017/09/13181340/subscribemsg2.png" className="img img-fluid" />
        </div>
        <div className="signup-container-input">
          <input value={this.state.value} onChange={this.handleChange} onFocus={this.handleFocus} onBlur={this.handleBlur} onKeyPress={this.handleKeyPress} type="text" name="email" ref="emailInput" className="enterEmail" placeholder="you@youremail.com"></input>
        </div>
        <div className="signup-container-btn">
          <button onClick={this.handleSubmit}>SIGN UP</button>
        </div>
      </div>
      </span>
    );


    return (
      <div className={this.state.loaded ? "globalFooter loaded" : "globalFooter notloaded"}>
      <footer>
        <div className={!this.state.smallScreen ? "largeScreenFooter" : "smallScreenFooter"} >
        {!this.state.smallScreen && largeScreenSignupContainer}
        {this.state.smallScreen && smallScreenSignupContainer}
          <div className="footerLowerContainer">
            <div className="footerLinksContainer">
              <div className="footerLinks">
                {footerMenu || ""}
              </div>
            </div>
            <div className="footerBrandingContainer">
              <div className="footerBranding">
                <div className="footerLogos">
                  <div className="footer-lifetime-logo"><Link to="http://www.mylifetime.com/shows/american-beauty-star" target="_blank"><img src="https://d1bud3tr8474k6.cloudfront.net/wp-content/uploads/2017/08/25194021/footer-lifetime.png" className="img img-fluid" /></Link></div>
                  <div className="footer-herrick-logo"><Link to="https://www.herrickentertainment.com/television.php" target="_blank"><img src="https://d1bud3tr8474k6.cloudfront.net/wp-content/uploads/2017/08/25194020/footer-herrick.png" className="img img-fluid" /></Link></div>
                </div>
                <div className="copyRight">&copy; American Beauty Digital Media, LLC All Rights Reserved</div>
                <div className="appStoreLinks">
                  <div className="store"><Link to="https://play.google.com/store/apps/details?id=com.dotstudioz.dotstudioPRO.abs" target="_blank"><img src="https://s3-us-west-2.amazonaws.com/amer-bstar-prod-s3-assets-zngq8vlxtpl7/wp-content/uploads/2017/12/15170029/playstore.png" /></Link></div>
                  <div className="store"><Link to="https://itunes.apple.com/us/app/american-beauty-star/id1315871855?mt=8" target="_blank"><img src="https://s3-us-west-2.amazonaws.com/amer-bstar-prod-s3-assets-zngq8vlxtpl7/wp-content/uploads/2017/12/15170029/itunes.png" /></Link></div>
                  <div className="store"><Link to="https://channelstore.roku.com/details/200404/american-beauty-star" target="_blank"><img src="https://s3-us-west-2.amazonaws.com/amer-bstar-prod-s3-assets-zngq8vlxtpl7/wp-content/uploads/2017/12/15170030/roku.png" /></Link></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
    );
  }
}
