import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {Link} from 'react-router';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { updateProgressBar } from 'redux/modules/progress';
import Util from '../../helpers/Util';

@connect(state => ({
  progress: state.progress
}), { updateProgressBar })

export default class FAQ extends Component {
  static propTypes = {
    updateProgressBar: PropTypes.func.isRequired,
    progress: PropTypes.object
  };

  componentDidMount() {
    this.props.updateProgressBar(100);
  }

  render() {
    Util.redirectIfFirstTimeVisitor();

    return (
      <div className="container">
        <Helmet title="Frequently Asked Questions"/>
          <div className="row">
            <div className="col-xs-1 basic-text"></div>
            <div className="col-xs-10 basic-text">
              <div className="row"><div className="col-xs-12"><h4>FREQUENTLY-ASKED QUESTIONS</h4></div></div>
              <div className="row"><div className="col-xs-12"><h4>What is Nosey?</h4></div></div>
              <div className="row"><div className="col-xs-12">Instantly watch free TV shows and movies from your desktop, mobile device, Apple TV or Roku platform. Nosey was created to deliver unique and underrepresented content such as court shows, reality TV shows, and game shows to your lap. Get Nosey and get 24/7 free streaming TV. Always free, all the time.</div></div>
              <div className="row"><div className="col-xs-12"><h4>How much does Nosey cost?</h4></div></div>
              <div className="row"><div className="col-xs-12">Nosey is ad-supported to provide a premium experience to you for free. Enjoy all the content you love without paying for it.</div></div>
              <div className="row"><div className="col-xs-12"><h4>Do I need an account to access the content?</h4></div></div>
              <div className="row"><div className="col-xs-12">No account is needed to access Nosey, though registration is free and will provide additional features such as Watched which will save your viewing progress. Enjoy Nosey from any computer through a web browser by going to www.nosey.com or by downloading the app on a iOS, Android, Apple TV or Roku device.</div></div>
              <div className="row"><div className="col-xs-12"><h4>How can I learn more about Nosey?</h4></div></div>
              <div className="row"><div className="col-xs-12">Follow us on social media to join the community and to get up to date information on the hottest shows.
              <ul>
                <li><Link to="https://www.facebook.com/GetNosey/" target="_blank">https://www.facebook.com/GetNosey/</Link> </li>
                <li><Link to="https://twitter.com/GetNosey" target="_blank">https://twitter.com/GetNosey</Link></li>
              </ul>
              </div></div>
              <div className="row"><div className="col-xs-12"><h4>What’s the selection like?</h4></div></div>
              <div className="row"><div className="col-xs-12">Nosey content ranges from Reality TV shows to Game shows. We are constantly sourcing and adding new material to better cater to our user’s interests. If you have any tips or suggestions, let us know.</div></div>
              <div className="row"><div className="col-xs-12"><h4>Is Nosey available outside of The United States?</h4></div></div>
              <div className="row"><div className="col-xs-12">No. It is currently available only in the United States.</div></div>
              <div className="row"><div className="col-xs-12"><h4>How do I search for content?</h4></div></div>
              <div className="row"><div className="col-xs-12">
                <ul>
                  <li><u>Computer</u>: The top left side is a hamburger menu icon that breaks down the content by genre. The top right side of the homepage you will see a white search bar icon. Type in the show title, episode name or description of what type of content you’re looking for and you will be taken to a results page. </li>
                  <li><u>Phone App + Tablets</u>: Tap on the search icon in the upper right-hand corner within the browse view to browse the different genres and sections of the site. </li>
                  <li><u>Roku</u>: Navigate to the top of the Nosey Roku app to find the different genres on the site. There you will also find a search feature.</li>
                </ul>
              </div></div>
              <div className="row"><div className="col-xs-12"><h4>How fast does my Internet need to be?</h4></div></div>
              <div className="row"><div className="col-xs-12">The minimum recommended internet speed for a smooth playback experience is 1.5 Mbps. You can test your internet speed by going to: www.speedtest.net.</div></div>
              <div className="row"><div className="col-xs-12"><h4>What happens if my video isn’t loading?</h4></div></div>
              <div className="row"><div className="col-xs-12">We recommend refreshing the page and disconnecting then reconnecting your Internet connection.  If that still does not work, consider connecting your computer directly to your modem or restarting your home network. </div></div>
              <div className="row"><div className="col-xs-12"><h4>What does Buffering mean?</h4></div></div>              <div className="row"><div className="col-xs-12">Buffering is when the video player is attempting to connect with the server to continue to play a video. This typically happens due to having a poor internet connection (slow or spotty). Generally plugging your device directly into a wired internet or obtaining a faster internet connection will help reduce buffering.</div></div>
              <div className="row"><div className="col-xs-12"><h4>What do I do if closed captioning is not loading?</h4></div></div>
              <div className="row"><div className="col-xs-12">Make sure that the correct selection in Closed Captioning (CC) is selected (English). If everything is correct and you still don’t see closed captioning, please contact support@nosey.com and mention which episode and on what device you are having this closed captioning problem with.</div></div>
              <div className="row"><div className="col-xs-12"><h4>How do I contact Nosey?</h4></div></div>
              <div className="row"><div className="col-xs-12">You can click the Contact Us in the footer or you can directly send an email to: support@nosey.com. Feel free to email us any questions, comments, or general feedback. We’d love to hear from you! </div></div>
            </div>
            <div className="col-xs-1 basic-text"></div>
          </div>
        </div>
    );
  }
}
