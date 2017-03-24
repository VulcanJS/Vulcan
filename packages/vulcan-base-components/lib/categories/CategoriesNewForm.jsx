import React, { PropTypes, Component } from 'react';
import { intlShape } from 'react-intl';
import { Components, registerComponent, getFragment, withMessages } from 'meteor/vulcan:core';
import Categories from "meteor/vulcan:categories";

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
  closeCallback: React.PropTypes.func,
  flash: React.PropTypes.func,
};

CategoriesNewForm.contextTypes = {
  intl: intlShape,
};

registerComponent('CategoriesNewForm', CategoriesNewForm, withMessages);
