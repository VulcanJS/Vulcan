import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { intlShape } from 'react-intl';
import NovaForm from "meteor/nova:forms";
import { withRouter } from 'react-router'
import Posts from "meteor/nova:posts";
import update from 'immutability-helper';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const PostsNewForm = (props, context) => {
  return (
    <Telescope.components.CanDo
      action="posts.new"
      noPermissionMessage="users.cannot_post"
      displayNoPermissionMessage={true}
    >
      <div className="posts-new-form">
        <NovaForm
          collection={Posts}
          queryToUpdate="postsListQuery"
          successCallback={post => {
            props.router.push({pathname: Posts.getPageUrl(post)});
            context.closeCallback();
            props.flash(context.intl.formatMessage({id: "posts.created_message"}), "success");
          }}
        />
      </div>
    </Telescope.components.CanDo>
  );
};

PostsNewForm.propTypes = {
  router: React.PropTypes.object,
  flash: React.PropTypes.func,
}

PostsNewForm.contextTypes = {
  closeCallback: React.PropTypes.func,
  intl: intlShape
};

PostsNewForm.displayName = "PostsNewForm";

const mapStateToProps = state => ({ messages: state.messages });
const mapDispatchToProps = dispatch => bindActionCreators(Telescope.actions.messages, dispatch);

Telescope.registerComponent('PostsNewForm', PostsNewForm, withRouter, connect(mapStateToProps, mapDispatchToProps));