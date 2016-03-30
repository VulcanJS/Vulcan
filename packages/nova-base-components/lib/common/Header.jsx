import React from 'react';
import NoSSR from 'react-no-ssr';
import Router from '../router.js'
import Core from "meteor/nova:core";

const Messages = Core.Messages;

import SmartContainers from "meteor/utilities:react-list-container";
const ListContainer = SmartContainers.ListContainer;

const Header = ({currentUser}) => {
  
  ({Logo, CategoriesList, NewPostButton, UserMenu, AccountsMenu, HeadTags} = Telescope.components);

  const logoUrl = Telescope.settings.get("logoUrl");
  const siteTitle = Telescope.settings.get("title", "Telescope");
  const tagline = Telescope.settings.get("tagline");

  return (
    <div className="header-wrapper">

      {/*<HeadTags url={Telescope.utils.getSiteUrl()} title={siteTitle} description={tagline} image={logoUrl} />*/}

      <header className="header">

        <div className="logo">
          <Logo logoUrl={logoUrl} siteTitle={siteTitle} />
          {tagline ? <h2 className="tagline">{tagline}</h2> : "" }
        </div>
        
        <div className="nav">
          
          <div className="nav-user">
            {currentUser ? <UserMenu user={currentUser}/> : <AccountsMenu/>}
          </div>

          <div className="nav-new-post">
            <NewPostButton/>
          </div>

        </div>

      </header>
    </div>
  )
}

module.exports = Header;
