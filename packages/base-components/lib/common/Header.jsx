import NoSSR from 'react-no-ssr';


const Header = props => {
  
  ({Logo, ListContainer, CategoriesList, FlashContainer, ModalButton, NewDocContainer, CanCreatePost} = Telescope.components);

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
        <ListContainer collection={Categories} limit={0}><CategoriesList/></ListContainer>
      </div>
      
      <NoSSR onSSR={<p>Loading…</p>}>
        <LogInButtons />
      </NoSSR>
      
      {props.currentUser ? <p><a href={FlowRouter.path("account")}>My Account</a></p> : ""}

      <CanCreatePost user={props.currentUser}>
        <ModalButton label="New Post" className="button button--primary">
          <NewDocContainer collection={Posts} label="New Post" methodName="posts.new" callback={(post)=>{FlowRouter.go('posts.single', post);}}/>
        </ModalButton>
      </CanCreatePost>

      <FlashContainer />

    </header>
  )
}

module.exports = Header;