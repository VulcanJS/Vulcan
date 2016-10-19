import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { intlShape } from 'react-intl';
import NovaForm from "meteor/nova:forms";
import { withRouter } from 'react-router'
import Posts from "meteor/nova:posts";

const PostsNewForm = (props, context) => {
  
  const router = props.router;

  return (
    <Telescope.components.CanDo
      action="posts.new"
      noPermissionMessage="users.cannot_post"
      displayNoPermissionMessage={true}
    >
      <div className="posts-new-form">
        <NovaForm 
          collection={Posts} 
          methodName="posts.new"
          successCallback={(post)=>{
            props.flash(context.intl.formatMessage({id: "posts.created_message"}), "success");
            router.push({pathname: Posts.getPageUrl(post)});
          }}
        />
      </div>
    </Telescope.components.CanDo>
  )
}

PostsNewForm.contextTypes = {
  currentUser: React.PropTypes.object,
  intl: intlShape
};

PostsNewForm.displayName = "PostsNewForm";

const mapStateToProps = state => ({ messages: state.messages });
const mapDispatchToProps = dispatch => bindActionCreators(Telescope.actions.messages, dispatch);

// note: why having both module.exports & export default?
module.exports = withRouter(connect(mapStateToProps, mapDispatchToProps)(PostsNewForm));
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PostsNewForm));