import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage, intlShape } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import NovaForm from "meteor/nova:forms";
import Users from 'meteor/nova:users';
import { withSingle } from 'meteor/nova:core';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const UsersEditForm = (props, context) => {

  if (props.data.loading) {
    
    return <div className="page users-edit-form"><Telescope.components.Loading/></div>
  
  } else {
    
    const user = props.data.user;

    return (
      <Telescope.components.CanDo 
        action="users.edit"
        document={user}
        displayNoPermissionMessage={true}
      >
        <div className="page users-edit-form">
          <h2 className="page-title users-edit-form-title"><FormattedMessage id="users.edit_account"/></h2>
          <NovaForm 
            collection={Users} 
            document={user} 
            mutationName="usersEdit"
            // fragment={Users.fragments.full}
            successCallback={(user)=>{
              props.flash(context.intl.formatMessage({id: "users.edit_success"}, {name: Users.getDisplayName(user)}), 'success')
            }}
            noRemoveMutation={true}
          />
        </div>
      </Telescope.components.CanDo>
    )
  }
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

Telescope.registerComponent('UsersEditForm', UsersEditForm, connect(mapStateToProps, mapDispatchToProps)/*, withSingle*/);