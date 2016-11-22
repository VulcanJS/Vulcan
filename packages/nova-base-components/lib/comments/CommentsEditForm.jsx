import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import NovaForm from "meteor/nova:forms";
import Comments from "meteor/nova:comments";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const CommentsEditForm = (props, context) => {
  return (
    <div className="comments-edit-form">
      <NovaForm 
        layout="elementOnly"
        collection={Comments}
        document={props.comment}
        mutationName="commentsEdit"
        // fragment={Comments.fragments.list}
        successCallback={props.successCallback}
        cancelCallback={props.cancelCallback}
        removeSuccessCallback={props.removeSuccessCallback}
      />
    </div>
  )
}

CommentsEditForm.propTypes = {
  comment: React.PropTypes.object.isRequired,
  successCallback: React.PropTypes.func,
  cancelCallback: React.PropTypes.func
};

const mapStateToProps = state => ({ messages: state.messages });
const mapDispatchToProps = dispatch => bindActionCreators(Telescope.actions.messages, dispatch);

Telescope.registerComponent('CommentsEditForm', CommentsEditForm, connect(mapStateToProps, mapDispatchToProps));