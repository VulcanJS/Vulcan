import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';
import { Components, registerComponent, getFragment, withMessages } from 'meteor/vulcan:core';
import { Categories } from '../../modules/categories/index.js';

const CategoriesNewForm = (props, context) => {

  return (
    <div className="categories-new-form">
      <Components.SmartForm 
        collection={Categories}
        mutationFragment={getFragment('CategoriesList')}
        successCallback={category => {
          props.closeModal();
          props.flash(context.intl.formatMessage({id: 'categories.new_success'}, {name: category.name}), "success");
        }}
      />
    </div>
  )
}

CategoriesNewForm.displayName = "CategoriesNewForm";

CategoriesNewForm.propTypes = {
  closeCallback: PropTypes.func,
  flash: PropTypes.func,
};

CategoriesNewForm.contextTypes = {
  intl: intlShape,
};

registerComponent('CategoriesNewForm', CategoriesNewForm, withMessages);
