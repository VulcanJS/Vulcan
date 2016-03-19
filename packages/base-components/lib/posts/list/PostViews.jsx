const PostViews = props => {

  let views = ["top", "new", "best", "daily"];
  const adminViews = ["pending", "rejected", "scheduled"];
  
  if (Users.is.admin(Meteor.user())) {
    views = views.concat(adminViews);
  }

  return (
    <div className="post-views">
      <h4>Sort By:</h4>
      <ul>
        {views.map(view => 
          <li key={view}><a href={FlowRouter.path("/", null, {view})}>{view}</a></li>
        )}
      </ul>
    </div>
  )
}

module.exports = PostViews;
