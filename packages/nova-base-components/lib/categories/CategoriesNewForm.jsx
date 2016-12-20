import { Components, registerComponent } from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import Categories from "meteor/nova:categories";
import { withMessages } from 'meteor/nova:core';
import SmartForm from "meteor/nova:forms";
import update from 'immutability-helper';

const CategoriesNewForm = (props, context) => {

  return (
    <div className="categories-new-form">
      <SmartForm 
        collection={Categories} 
        queryToUpdate="categoriesListQuery"
        successCallback={category => {
          context.closeCallback();
          props.flash("Category created.", "success");
        }}
      />
    </div>
  )
}

CategoriesNewForm.displayName = "CategoriesNewForm";

CategoriesNewForm.contextTypes = {
  closeCallback: React.PropTypes.func,
};

registerComponent('CategoriesNewForm', CategoriesNewForm, withMessages);