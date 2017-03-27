import React, { PropTypes, Component } from 'react';
import { intlShape } from 'react-intl';
import { Components, registerComponent, getFragment, withMessages } from 'meteor/vulcan:core';
import Categories from "meteor/vulcan:categories";

const CategoriesEditForm = (props, context) => {

  return (
    <div className="categories-edit-form">
      <div className="categories-edit-form-admin">
        <div className="categories-edit-form-id">ID: {props.category._id}</div>
      </div>
      <Components.SmartForm
        collection={Categories}
        documentId={props.category._id}
        mutationFragment={getFragment('CategoriesList')}
        successCallback={category => {
          props.closeModal();
          props.flash(context.intl.formatMessage({id: 'categories.edit_success'}, {name: category.name}), "success");
        }}
        removeSuccessCallback={({documentId, documentTitle}) => {
          props.closeModal();
          props.flash(context.intl.formatMessage({id: 'categories.delete_success'}, {name: documentTitle}), "success");
          // context.events.track("category deleted", {_id: documentId});
        }}
        showRemove={true}
      />
    </div>
  )

};

CategoriesEditForm.propTypes = {
  category: React.PropTypes.object.isRequired,
  closeModal: React.PropTypes.func,
  flash: React.PropTypes.func,
}

CategoriesEditForm.contextTypes = {
  intl: intlShape,
  // events: React.PropTypes.object,
};

registerComponent('CategoriesEditForm', CategoriesEditForm, withMessages);
