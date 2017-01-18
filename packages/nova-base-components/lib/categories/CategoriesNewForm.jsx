import React, { PropTypes, Component } from 'react';
import { intlShape } from 'react-intl';
import { Components, registerComponent } from 'meteor/nova:lib';
import Categories from "meteor/nova:categories";
import { withMessages } from 'meteor/nova:core';

const CategoriesNewForm = (props, context) => {

  return (
    <div className="categories-new-form">
      <Components.SmartForm 
        collection={Categories} 
        successCallback={category => {
          props.closeCallback();
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
