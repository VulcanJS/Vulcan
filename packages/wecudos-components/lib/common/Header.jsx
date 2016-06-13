import React from 'react';
import NoSSR from 'react-no-ssr';
import Router from '../router.js'
import Core from "meteor/nova:core";

const Messages = Core.Messages;

import SmartContainers from "meteor/utilities:react-list-container";
const ListContainer = SmartContainers.ListContainer;

const Header = ({currentUser}) => {

  ({Logo, CategoriesList, PostsNewButton, UserMenu, AccountsMenu} = Telescope.components);

  const logoUrl = Telescope.settings.get("logoUrl");
  const siteTitle = Telescope.settings.get("title", "Nova");
  const tagline = Telescope.settings.get("tagline");

  return (
    <div className="header-wrapper">
      <div>
        { /* <header className="header"> */ }
          <div className="row">
            <div className="col-sm-4">
              <nav className="app-nav-menu">
                <a href="http://wecudos.com/" className="app-nav-menu-item">
                  <div data-hover="home" className="app-nav-menu-item-content">home</div>
                </a>
                <a href="http://wecudos.com/about" className="app-nav-menu-item">
                  <div data-hover="about" className="app-nav-menu-item-content">about</div>
                </a>
                <a href="http://wecudos.com/pros" className="app-nav-menu-item">
                  <div data-hover="pros" className="app-nav-menu-item-content">pros</div>
                </a>
                <a href="/" className="app-nav-menu-item app-nav-menu-item--active">
                  <div data-hover="community" className="app-nav-menu-item-content">community</div>
                </a>
              </nav>
            </div>
            <div className="col-sm-4 text-center">
              { /* <div className="logo"> */ }
              <div>
                <Logo logoUrl='/images/wecudos-logo-white.png' siteTitle={siteTitle} />
                { /* tagline ? <h2 className="tagline">{tagline}</h2> : "" */ }
              </div>
            </div>
            <div className="col-sm-4 text-right">
              <div className="app-nav-menu"> { /* className="nav" */ }
                <div className="nav-user">
                  {currentUser ? <UserMenu user={currentUser}/> : <AccountsMenu/>}
                </div>
                <div className="nav-new-post">
                  <PostsNewButton/>
                </div>
              </div>
            </div>
          </div>
          { /* </header> */ }
      </div>
    </div>
  )
}

module.exports = Header;
