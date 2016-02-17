let views = ["top", "new", "best", "daily"];
const adminViews = ["pending", "rejected", "scheduled"];

const PostViews = props => {
  
  if (Users.is.admin(Meteor.user())) {
    views = views.concat(adminViews);
  }

  return (
    <div className="post-views">
      <ul>
        <li>Sort by:</li>
        {views.map(view => 
          <li key={view}><a href={FlowRouter.extendPathWithQueryParams("PostDefault", {}, {view: view})}>{view}</a></li>
        )}
      </ul>
    </div>
  )
}

module.exports = PostViews;
