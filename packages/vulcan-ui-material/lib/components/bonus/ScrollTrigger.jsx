import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _throttle from 'lodash/throttle';

class ScrollTrigger extends Component {

  constructor (props) {
    super();

    this.onScroll = _throttle(this.onScroll.bind(this), 100, {
      leading: true,
      trailing: true,
    });

    this.onResize = _throttle(this.onResize.bind(this), 100, {
      leading: true,
      trailing: true,
    });

    this.element = React.createRef();
    this.passive = this.supportsPassive() ? { passive: true } : false;
  }

  supportsPassive () {
    let supportsPassive = false;
    try {
      const opts = Object.defineProperty({}, 'passive', {
        //eslint-disable-next-line getter-return
        get: function () {
          supportsPassive = true;
        }
      });
      window.addEventListener('testPassive', null, opts);
      window.removeEventListener('testPassive', null, opts);
      //eslint-disable-next-line no-empty
    } catch (e) {}
    return supportsPassive;
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.checkStatus();
    return false;
  }

  componentDidMount () {
    this.addEventListeners();
  }

  componentWillUnmount () {
    this.removeEventListeners();
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (prevProps.scroller !== this.props.scroller) {
      this.removeEventListeners();
      if (this.props.scroller) {
        this.addEventListeners();
      }
    }
    this.checkStatus();
  }

  addEventListeners () {
    if (this.props.scroller === window) {
      window.addEventListener('scroll', this.onScroll);
    } else if (this.props.scroller) {
      this.props.scroller.addEventListener('scroll', this.onScroll, this.passive);
    }

    if (window) {
      window.addEventListener('resize', this.onResize, this.passive);
    }

    if (this.props.triggerOnLoad) {
      this.checkStatus();
    }
  }

  removeEventListeners () {
    if (this.props.scroller === window) {
      window.removeEventListener('scroll', this.onScroll);
    } else if (this.props.scroller) {
      this.props.scroller.removeEventListener('scroll', this.onScroll);
    }

    if (window) {
      window.removeEventListener('resize', this.onResize);
    }
  }

  onResize () {
    this.checkStatus();
  }

  onScroll () {
    this.checkStatus();
  }

  checkStatus () {
    const { onTrigger, scroller } = this.props;
    if (!onTrigger || !scroller || !this.element.current) return;

    const elementRect = this.element.current.getBoundingClientRect();
    const viewportEnd = this.props.scroller.clientHeight + this.props.preloadHeight;
    const inViewport = elementRect.top < viewportEnd;

    if (inViewport) {
      onTrigger(this);
    }
  }

  render () {
    const {
      children,
    } = this.props;

    return (
      <div ref={this.element}>
        {children}
      </div>
    );
  }
}


ScrollTrigger.propTypes = {
  scroller: PropTypes.object,
  triggerOnLoad: PropTypes.bool,
  preloadHeight: PropTypes.number,
  onTrigger: PropTypes.func,
};


ScrollTrigger.defaultProps = {
  scroller: typeof window !== 'undefined' ? window : null,
  preloadHeight: 1000,
  triggerOnLoad: true,
};


export default ScrollTrigger;
