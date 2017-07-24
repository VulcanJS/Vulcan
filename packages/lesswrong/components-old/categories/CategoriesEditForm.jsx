import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';
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
          props.flash(context.intl.formatMessage({ id: 'categories.edit_success' }, { name: category.name }), 'success');
        }}
        removeSuccessCallback={({ documentId, documentTitle }) => {
          props.closeModal();
          props.flash(context.intl.formatMessage({ id: 'categories.delete_success' }, { name: documentTitle }), 'success');
          // context.events.track("category deleted", {_id: documentId});
        }}
        showRemove={true}
      />
    </div>
  );
};

CategoriesEditForm.propTypes = {
  category: PropTypes.object.isRequired,
  closeModal: PropTypes.func,
  flash: PropTypes.func,
};

CategoriesEditForm.contextTypes = {
  intl: intlShape,
};

registerComponent('CategoriesEditForm', CategoriesEditForm, withMessages);
