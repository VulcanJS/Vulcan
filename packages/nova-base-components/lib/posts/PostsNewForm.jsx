import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { intlShape } from 'react-intl';
import NovaForm from "meteor/nova:forms";
import { withRouter } from 'react-router'
import Posts from "meteor/nova:posts";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

const PostsNewForm = (props, context) => {
  return (
    <ShowIf
      check={Posts.options.mutations.new.check}
      failureComponent={<FormattedMessage id="users.cannot_post"/>}
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
    </ShowIf>
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