import React, { PropTypes, Component } from 'react';
import Router from '../router.js'

import { Messages } from "meteor/nova:core";

import NovaForm from "meteor/nova:forms";

const CategoriesNewForm = (props, context) => {

  return (
    <div className="categories-new-form">
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

CategoriesNewForm.displayName = "CategoriesNewForm";

CategoriesNewForm.contextTypes = {
  currentUser: React.PropTypes.object
};

module.exports = CategoriesNewForm;
export default CategoriesNewForm;