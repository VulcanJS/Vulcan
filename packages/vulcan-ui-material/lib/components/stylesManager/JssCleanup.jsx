/**
 * Remove JSS style tag after rehydratation
 *
 * @see https://cssinjs.org/server-side-rendering?v=v10.7.1
 */
import React, { PureComponent } from 'react';

export class JssCleanup extends PureComponent {
  // Remove the server-side injected CSS.
  componentDidMount() {
    if (!document || !document.getElementById) return;

    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    return this.props.children;
  }
}

export default JssCleanup;
