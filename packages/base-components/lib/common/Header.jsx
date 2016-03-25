import NoSSR from 'react-no-ssr';
import Router from '../router.js'
import Core from "meteor/nova:core";

const Messages = Core.Messages;

const Header = ({currentUser}) => {
  
  ({Logo, ListContainer, CategoriesList, NewPostButton} = Telescope.components);

  const logoUrl = Telescope.settings.get("logoUrl");
  const siteTitle = Telescope.settings.get("title", "Telescope");
  const tagline = Telescope.settings.get("tagline");

  return (
    <div className="header-wrapper">
      <header className="header">
       <div className="logo">
          <Logo logoUrl={logoUrl} siteTitle={siteTitle} />
          {tagline ? <h2 className="tagline">{tagline}</h2> : "" }
        </div>
        
        <LogInButtons />
        
        {currentUser ? <p><a href={Router.path("account")}>My Account</a></p> : ""}

        <NewPostButton/>
      
      </header>
    </div>
  )
}

module.exports = Header;
