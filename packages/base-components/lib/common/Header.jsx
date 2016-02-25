import NoSSR from 'react-no-ssr';


const Header = props => {
  
  ({Logo, ListContainer, CategoriesList, FlashContainer, NewPostButton, ModalButton, PostNewContainer, CurrentUserContainer, PostNew} = Telescope.components);

  const logoUrl = Telescope.settings.get("logoUrl");
  const siteTitle = Telescope.settings.get("title", "Telescope");
  const tagline = Telescope.settings.get("tagline");

  return (
    <header className="header">
     <div className="logo">
        <Logo logoUrl={logoUrl} siteTitle={siteTitle} />
        {tagline ? <h2 className="tagline">{tagline}</h2> : "" }
      </div>
      <div className="nav">
        {<ListContainer collection={Categories} component={CategoriesList} limit={0}/>}
      </div>
      
      <NoSSR onSSR={<p>Loading…</p>}>
        <LogInButtons />
      </NoSSR>
      
      {props.currentUser ? <p><a href={FlowRouter.path("account")}>My Account</a></p> : ""}

      <ModalButton label="New Post" className="button button--primary"><CurrentUserContainer><PostNew /></CurrentUserContainer></ModalButton>

      <FlashContainer />

    </header>
  )
}

module.exports = Header;