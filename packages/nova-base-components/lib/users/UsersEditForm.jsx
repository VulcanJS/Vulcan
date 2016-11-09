import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage, intlShape } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import NovaForm from "meteor/nova:forms";
import Users from 'meteor/nova:users';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const UsersEditForm = (props, context) => {

  const user = props.document;

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
          resultQuery={Users.graphQLQueries.single}
          successCallback={(user)=>{
            props.flash(context.intl.formatMessage({id: "users.edit_success"}, {name: Users.getDisplayName(user)}), 'success')
          }}
        />
      </div>
    </Telescope.components.CanDo>
  )
};

  
UsersEditForm.propTypes = {
  document: React.PropTypes.object,
};

UsersEditForm.contextTypes = {
  currentUser: React.PropTypes.object,
  intl: intlShape
};

UsersEditForm.displayName = "UsersEditForm";

const mapStateToProps = state => ({ messages: state.messages, });
const mapDispatchToProps = dispatch => bindActionCreators(Telescope.actions.messages, dispatch);

module.exports = connect(mapStateToProps, mapDispatchToProps)(UsersEditForm);
export default connect(mapStateToProps, mapDispatchToProps)(UsersEditForm);