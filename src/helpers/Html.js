import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import ReactDOM from 'react-dom/server';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';
import config from '../config';

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */
export default class Html extends Component {
  static propTypes = {
    assets: PropTypes.object,
    component: PropTypes.node,
    store: PropTypes.object
  };

  cssStyle() {
    if (config.staging) return false;
    return (<link rel="stylesheet" href={"//" + config.wpApi.baseUrl + "/wp-json/dsp/v1/css/site"} />)
  }

  render() {
    const { assets, component, store } = this.props;
    const content = component ? ReactDOM.renderToStaticMarkup(component) : '';
    const head = Helmet.rewind();

    return (
      <html lang="en-us">
      <head>
        {head.base.toComponent()}
        {head.title.toComponent()}
        {head.meta.toComponent()}
        {head.link.toComponent()}
        {head.script.toComponent()}

        <link rel="shortcut icon" href="/favicon.ico"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        {/* styles (will be present only in production with webpack extract text plugin) */}
        {Object.keys(assets.styles).map((style, key) =>
          <link href={assets.styles[style]} key={key} media="screen, projection"
                rel="stylesheet" type="text/css" charSet="UTF-8"/>
        )}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
        <script src="//cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en"/>

        {/* Facebook Javscript SDK */}
        <script dangerouslySetInnerHTML={{
          __html: `
            window.fbAsyncInit = function(){FB.init({appId:'254529085040669',xfbml: true,version    : 'v2.9'});FB.AppEvents.logPageView();};(function(d, s, id){var js, fjs = d.getElementsByTagName(s)[0];if (d.getElementById(id)) {return;}js = d.createElement(s); js.id = id;js.src = "//connect.facebook.net/en_US/sdk.js";fjs.parentNode.insertBefore(js, fjs);}(document, 'script', 'facebook-jssdk'));`
        }}/>

        {/* Google analytics */}
        <script dangerouslySetInnerHTML={{
          __html: `
           (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');ga('create','UA-106753337-1','auto');ga('send','pageview');`
        }}/>

        {/* Adsense scripts */}
        <script src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"/>
        <script dangerouslySetInnerHTML={{ __html: `(adsbygoogle = window.adsbygoogle || []).push({google_ad_client: "ca-pub-2794442115238011",enable_page_level_ads: true});`}}/>

        {/* (will be present only in development mode) */}
        {/* outputs a <style/> tag with all bootstrap styles + App.less + it could be CurrentPage.scss. */}
        {/* can smoothen the initial style flash (flicker) on page load in development mode. */}
        {/* ideally one could also include here the style for the current page (Home.scss, About.scss, etc) */}
        { Object.keys(assets.styles).length === 0 ? <style
          dangerouslySetInnerHTML={{ __html: require('../theme/bootstrap.config.js') + require('../containers/App/App.less')._style }}/> : null }
        {this.cssStyle()}
      </head>
      <body>
      <div id="fb-root"></div>
      <div id="content" dangerouslySetInnerHTML={{ __html: content }}/>
      <script dangerouslySetInnerHTML={{ __html: `window.__data=${serialize(store.getState())};` }} charSet="UTF-8"/>
      <script src={assets.javascript.main} charSet="UTF-8"/>
      {/* Spoutable Ad Script
      <script id="spout-tag-4a1a6e35-0afa-4c8d-b6a8-871d47fe5d9b" dangerouslySetInnerHTML={{ __html: `!function(){var e=encodeURIComponent(top.document.referrer.substring(0,250)),t=encodeURIComponent(top.document.location.href.substring(0,250)),o=Date.now(),n="4a1a6e35-0afa-4c8d-b6a8-871d47fe5d9b",s=document.createElement("script"),a=sessionStorage.getItem("spoutable-"+n);if(!a){var r=Math.random.bind(Math);a=JSON.stringify({sessionId:[o,r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r()]}),sessionStorage.setItem("spoutable-"+n,a)}s.async=!0,s.src="//s.spoutable.com/s?u="+n+"&s="+encodeURIComponent(a)+"&t="+o+"&r="+e+"&p="+t,document.head.appendChild(s)}();`}} />
      <script id="spout-tag-2ac775ca-7f12-4c51-9861-310a24957b1a" dangerouslySetInnerHTML={{ __html: `
        !function(){var e=encodeURIComponent(top.document.referrer.substring(0,250)),t=encodeURIComponent(top.document.location.href.substring(0,250)),o=Date.now(),n="2ac775ca-7f12-4c51-9861-310a24957b1a",s=document.createElement("script"),a=sessionStorage.getItem("spoutable-"+n);if(!a){var c=Math.random.bind(Math);a=JSON.stringify({sessionId:[o,c(),c(),c(),c(),c(),c(),c(),c(),c(),c(),c(),c()]}),sessionStorage.setItem("spoutable-"+n,a)}s.async=!0,s.src="//s.spoutable.com/s?u="+n+"&s="+encodeURIComponent(a)+"&t="+o+"&r="+e+"&p="+t,document.head.appendChild(s)}();`}} /> */}
      </body>
      </html>
    );
  }
}
