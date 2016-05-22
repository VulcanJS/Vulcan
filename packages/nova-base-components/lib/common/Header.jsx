import React from 'react';
import NoSSR from 'react-no-ssr';
import { Messages } from "meteor/nova:core";

import SmartContainers from "meteor/utilities:react-list-container";
const ListContainer = SmartContainers.ListContainer;

const Header = ({currentUser}) => {
  
  ({Logo, CategoriesList, PostsNewButton, UsersMenu, UsersAccountMenu} = Telescope.components);

  const logoUrl = Telescope.settings.get("logoUrl");
  const siteTitle = Telescope.settings.get("title", "Nova");
  const tagline = Telescope.settings.get("tagline");

  return (
    <div className="header-wrapper">

      <header className="header">

        <div className="logo">
          <Logo logoUrl={logoUrl} siteTitle={siteTitle} />
          {tagline ? <h2 className="tagline">{tagline}</h2> : "" }
        </div>
        
        <div className="nav">
          
          <div className="nav-user">
            {currentUser ? <UsersMenu user={currentUser}/> : <UsersAccountMenu/>}
          </div>

          <div className="nav-new-post">
            <PostsNewButton/>
          </div>

        </div>

      </header>
    </div>
  )
}

module.exports = Header;
