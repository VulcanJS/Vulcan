import React from 'react';
import { withCurrentUser, getSetting, Components, registerComponent } from 'meteor/vulcan:core';

const Header = (props, context) => {
  
  const logoUrl = getSetting("logoUrl");
  const siteTitle = getSetting("title", "My App");
  const tagline = getSetting("tagline");

  return (
    <div className="header-wrapper">

      <header className="header">

        <div className="logo">
          <Components.Logo logoUrl={logoUrl} siteTitle={siteTitle} />
          {tagline ? <h2 className="tagline">{tagline}</h2> : "" }
        </div>
        
        <div className="nav">
          
          <div className="nav-user">
            {!!props.currentUser ? <Components.UsersMenu/> : <Components.UsersAccountMenu/>}
          </div>

          <div className="nav-new-post">
            <Components.PostsNewButton/>
          </div>

        </div>

      </header>
    </div>
  )
}

Header.displayName = "Header";

Header.propTypes = {
  currentUser: React.PropTypes.object,
};

registerComponent('Header', Header, withCurrentUser);
