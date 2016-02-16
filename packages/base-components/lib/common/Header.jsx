const Header = props => {
  
  const Logo = Telescope.getComponent("Logo");

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
        <ul>
          <li>Nav link</li>
        </ul>
      </div>
    </header>
  )
}

module.exports = Header;