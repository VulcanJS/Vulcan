const Header = props => {
  
  ({Logo, ListContainer, CategoriesList} = Telescope.components);

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
      <LogInButtons />
      {props.currentUser ? <p><a href={FlowRouter.path("account")}>My Account</a></p> : ""}
      <a href={FlowRouter.path("posts.new")} className="button button--primary">New Post</a>
    </header>
  )
}

module.exports = Header;