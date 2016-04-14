import React, { PropTypes, Component } from 'react';
import Router from '../router.js'

import Core from "meteor/nova:core";
const Messages = Core.Messages;

import NovaForm from "meteor/nova:forms";

const CategoriesNewForm = (props, context) => {

  ({FlashMessages} = Telescope.components);

  return (
    <div className="new-category-form">
      <NovaForm 
        collection={Categories} 
        currentUser={context.currentUser}
        methodName="categories.new"
        successCallback={(category)=>{
          Messages.flash("Category created.", "success");
        }}
        labelFunction={(fieldName)=>Telescope.utils.getFieldLabel(fieldName, Categories)}
      />
    </div>
  )
}

CategoriesNewForm.contextTypes = {
  currentUser: React.PropTypes.object
};

module.exports = CategoriesNewForm;
export default CategoriesNewForm;