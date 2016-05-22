import React, { PropTypes, Component } from 'react';

import { FlashContainer } from "meteor/nova:core";

class Layout extends Component {

  render() {
    
    ({Header, Footer, FlashMessages, Newsletter, HeadTags, UsersProfileCheck} = Telescope.components);

    return (
      <div className="wrapper" id="wrapper">

        <HeadTags />

        <UsersProfileCheck {...this.props} />

        <Header {...this.props}/>
      
        <div className="main">

          <FlashContainer component={FlashMessages}/>

          <Newsletter />

          {this.props.children}

        </div>
      
        <Footer {...this.props}/>
      
      </div>
    )

  }
}

module.exports = Layout;