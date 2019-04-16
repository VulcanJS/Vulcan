import React, { PureComponent } from 'react';


class JssCleanup extends PureComponent {


  // Remove the server-side injected CSS.
  componentDidMount() {
    if (!document || !document.getElementById) return;
    
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
//      jssStyles.parentNode.removeChild(jssStyles);
    }
  }
  
  render() {
    return this.props.children;
  }
}


export default JssCleanup;
