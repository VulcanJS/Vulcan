import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage, intlShape } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import NovaForm from "meteor/nova:forms";
import Users from 'meteor/nova:users';
import { ShowIf, withCurrentUser } from 'meteor/nova:core';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const UsersEditForm = (props, context) => {
  return (
    <ShowIf
      check={Users.options.mutations.edit.check}
      document={{_id: props.userId}} // note: cannot handle slug atm
      failureComponent={<FormattedMessage id="app.noPermission"/>}
    >
      <div className="page users-edit-form">
        <h2 className="page-title users-edit-form-title"><FormattedMessage id="users.edit_account"/></h2>
        <NovaForm 
          collection={Users} 
          documentId={props.userId} // note: cannot handle slug atm
          queryToUpdate="usersSingleQuery"
          successCallback={(user)=>{
            props.flash(context.intl.formatMessage({id: "users.edit_success"}, {name: Users.getDisplayName(user)}), 'success')
          }}
          showRemove={false}
        />
      </div>
    </ShowIf>
  );
};

  
UsersEditForm.propTypes = {
  document: React.PropTypes.object,
};

UsersEditForm.contextTypes = {
  intl: intlShape
};

UsersEditForm.displayName = "UsersEditForm";

const mapStateToProps = state => ({ messages: state.messages, });
const mapDispatchToProps = dispatch => bindActionCreators(Telescope.actions.messages, dispatch);

Telescope.registerComponent('UsersEditForm', UsersEditForm, withCurrentUser, connect(mapStateToProps, mapDispatchToProps));