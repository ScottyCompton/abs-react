import React from 'react';
import Script from 'react-load-script';
import { PropTypes } from 'prop-types';

export default class Ad extends React.Component {

    static propTypes = {
        adScript: PropTypes.string.isRequired,
        container: PropTypes.string.isRequired
      };

    constructor(...options) {
        super(...options);
        this.releaseTimeout = undefined;
        this.state = {
            docWrite: false
        };
    }

    componentWillMount() {
         // debug('Execute ad load');
        const docInt = setInterval(() => {
            if (typeof document === 'undefined') return;
            clearInterval(docInt);
            console.log("document exists");
            document.write = function(s) {
                console.log(s);
            };
            this.parseAndDrawTags();
        }, 250);
    }

    componentWillUnmount() {
        if (this.op) {
            clearTimeout(this.releaseTimeout);
        }
    }

    handleScriptError() {
        console.log("err");
    }

    handleScriptLoad() {
        console.log("%c not err", 'background: #222; color: #bada55');
    }

    drawTagInner(inner, src, id, elem) {
        console.log("%c drawTagInner", 'background: #222; color: #bada55', inner, src, id, elem);
        if (inner) {
          console.log("%c We have inner...", 'background: #222; color: #bada55');
          let tag = document.createElement('script');
          // tag.setAttribute('async', false);
          tag.innerHTML = inner;
          tag.setAttribute('data-id', id);
          if (src) tag.setAttribute('src', src);
          console.log("TAG", tag);
          if (!document.getElementById(id)) tag.id = id;
          const elemCheck = setInterval(() => {
              const element = document.getElementById(elem);
              console.log("%c Attempting to get element by id: " + elem, 'background: #222; color: #bada55');
              if (!element) return;
              clearInterval(elemCheck);
              console.log("%c We have ad element...", 'background: #222; color: #bada55');
              element.appendChild(tag);
          }, 1000);
        }
    }

    parseAndDrawTags() {
      const { adScript, container } = this.props;
      if (adScript) {
        let doc = (new DOMParser()).parseFromString(adScript, "text/html");
        let headTags = doc.head.getElementsByTagName("*");
        let bodyTags = doc.body.getElementsByTagName("*");
        console.log("TAGS", headTags, bodyTags);
        for (let a=0; a<headTags.length; a++) {
          if (headTags[a].localName === 'script') {
            this.drawTagInner(headTags[a].innerHTML, headTags[a].src || null, headTags[a].id, container );
            continue;
          }
        }
        for (let a=0; a<bodyTags.length; a++) {
          if (bodyTags[a].localName === 'script') {
            this.drawTagInner(bodyTags[a].innerHTML, bodyTags[a].src || null, bodyTags[a].id, container);
            continue;
          }
        }
      }
    }

    render() {
        const { container } = this.props;
        return (<div id={container} />);
    }
}