import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import _throttle from 'lodash/throttle';


class ScrollTrigger extends Component {
  
  constructor (props) {
    super(props);
    
    this.onScroll = _throttle(this.onScroll.bind(this), 100, {
      leading: true,
      trailing: true,
    });
    
    this.onResize = _throttle(this.onResize.bind(this), 100, {
      leading: true,
      trailing: true,
    });
    
    this.inViewport = false;
    this.passive = this.supportsPassive ? { passive: true } : false;
  }
  
  supportsPassive () {
    let supportsPassive = false;
    try {
      const opts = Object.defineProperty({}, 'passive', {
        //eslint-disable-next-line getter-return
        get: function() {
          supportsPassive = true;
        }
      });
      window.addEventListener('testPassive', null, opts);
      window.removeEventListener('testPassive', null, opts);
      //eslint-disable-next-line no-empty
    } catch (e) {}
    return supportsPassive;
  }
  
  componentDidMount () {
    this.scroller = document.getElementById('main');
    this.scroller.addEventListener('resize', this.onResize, this.passive);
    this.scroller.addEventListener('scroll', this.onScroll, this.passive);
  
    this.inViewport = false;

    if (this.props.triggerOnLoad) {
      this.checkStatus();
    }
  }
  
  componentWillUnmount () {
    if (!this.scroller) return;
    this.scroller.removeEventListener('resize', this.onResize);
    this.scroller.removeEventListener('scroll', this.onScroll);
    this.scroller = null;
  }
  
  onResize () {
    this.checkStatus();
  }
  
  onScroll () {
    this.checkStatus();
  }
  
  checkStatus () {
    if (!this.scroller) return;
  
    const {
      onEnter,
    } = this.props;
    
    //eslint-disable-next-line
    const element = ReactDOM.findDOMNode(this.element);
    const elementRect = element.getBoundingClientRect();
    const viewportEnd = this.scroller.clientHeight + this.props.preload;
    const inViewport = elementRect.top < viewportEnd;
    
    if (inViewport) {
      if (!this.inViewport) {
        this.inViewport = true;
        
        onEnter(this);
      }
      
    } else {
      if (this.inViewport) {
        this.inViewport = false;
      }
    }
  }
  
  render () {
    const {
      children,
    } = this.props;
    
    return (
      <div ref={(element) => {this.element = element;}}>
        {children}
      </div>
    );
  }
}


ScrollTrigger.propTypes = {
  scrollerId: PropTypes.string,
  triggerOnLoad: PropTypes.bool,
  preload: PropTypes.number,
  onEnter: PropTypes.func,
};


ScrollTrigger.defaultProps = {
  scrollerId: 'main',
  preload: 1000,
  triggerOnLoad: true,
  onEnter: () => {},
};


export default ScrollTrigger;
