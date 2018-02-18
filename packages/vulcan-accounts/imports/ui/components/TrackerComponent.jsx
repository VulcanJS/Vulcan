/*****************************************************************/
/* See https://github.com/studiointeract/tracker-component
/* This is essentially the same component made by studiointeract
/* but modified to work correctly with modern React.
/* Only change as of this writing is to setState()
/****************************************************************/
import React from 'react';

class TrackerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.__subs = {}, this.__comps = []; this.__live = false;
    this.__subscribe = props && props.subscribe || Meteor.subscribe;
  }

  subscribe(name, ...options) {
    return this.__subs[JSON.stringify(arguments)] =
      this.__subscribe.apply(this, [name, ...options]);
  }

  autorun(fn) { return this.__comps.push(Tracker.autorun(c => {
    this.__live = true; fn(c); this.__live = false;
  }))}

  componentDidUpdate() { !this.__live && this.__comps.forEach(c => {
    c.invalidated = c.stopped = false; !c.invalidate();
  })}

  subscriptionsReady() {
    return !Object.keys(this.__subs).some(id => !this.__subs[id].ready());
  }

  setState(state){
    // Originally, this function was like so:
    //
    //     if (!this._reactInternalInstance)
    //       return this.state = Object.assign({}, this.state, state);
    //     else
    //       return super.setState.apply(this, arguments);
    //
    // But this didn't work well with new React releases.
    // _reactInternalInstance was always undefined and super.setState was never getting called.
    // This resulted in states never persistently updating and setState callbacks never called.
    // There may be some mysterious reason this was originally written this way hence I'm keeping
    // it here for reference for when we find out it's broken.

    const newState = Object.assign({}, this.state, state);
    this.state = newState;
    return super.setState(newState);
  }

  componentWillUnmount() {
    Object.keys(this.__subs).forEach(sub => this.__subs[sub].stop());
    this.__comps.forEach(comp => comp.stop());
  }

  render() {
    const { children } = this.props;
    const comp = (children instanceof Array ? children : [children]).map(c => React.cloneElement(c, this.state));
    return comp.length == 1 ? comp[0] : <div>{comp}</div>;
  }
}

export default TrackerComponent;
