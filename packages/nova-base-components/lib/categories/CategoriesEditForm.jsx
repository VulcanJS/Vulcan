import React, { PropTypes, Component } from 'react';
import { intlShape } from 'react-intl';
import { Components, registerComponent } from 'meteor/nova:lib';
import SmartForm from "meteor/nova:forms";
import Categories from "meteor/nova:categories";
import { withMessages } from 'meteor/nova:core';

const CategoriesEditForm = (props, context) => {

  return (
    <div className="categories-edit-form">
      <SmartForm
        collection={Categories}
        documentId={props.category._id}
        successCallback={category => {
          props.closeCallback();
          props.flash(context.intl.formatMessage({id: 'categories.edit_success'}, {name: category.name}), "success");
        }}
        removeSuccessCallback={({documentId, documentTitle}) => {
          props.closeCallback();
          props.flash(context.intl.formatMessage({id: 'categories.delete_success'}, {name: documentTitle}), "success");
          props.events.track("category deleted", {_id: documentId});
        }}
        showRemove={true}
      />
    </div>
  )

};

CategoriesEditForm.propTypes = {
  category: React.PropTypes.object.isRequired,
  closeCallback: React.PropTypes.func,
  flash: React.PropTypes.func,
}

CategoriesEditForm.contextTypes = {
  intl: intlShape,
  events: React.PropTypes.object,
};

registerComponent('CategoriesEditForm', CategoriesEditForm, withMessages);
