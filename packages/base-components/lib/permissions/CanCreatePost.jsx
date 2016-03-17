const CanCreatePost = ({user, children}) => {
  if (!user){
    return <p>Please log in.</p>;
  } else if (Users.can.post(user)) {
    return children;
  } else {
    return <p>Sorry, you do not have permissions to post at this time</p>;
  }
};

CanCreatePost.propTypes = {
  user: React.PropTypes.object
}

module.exports = CanCreatePost;