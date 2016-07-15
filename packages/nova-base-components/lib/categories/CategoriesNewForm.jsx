import React, { PropTypes, Component } from 'react';
//import { Messages } from "meteor/nova:core";
import Categories from "meteor/nova:categories";
import NovaForm from "meteor/nova:forms";

const CategoriesNewForm = (props, context) => {

  return (
    <div className="categories-new-form">
      <NovaForm 
        collection={Categories} 
        currentUser={context.currentUser}
        methodName="categories.new"
        successCallback={(category)=>{
          context.messages.flash("Category created.", "success");
        }}
      />
    </div>
  )
}

CategoriesNewForm.displayName = "CategoriesNewForm";

CategoriesNewForm.contextTypes = {
  currentUser: React.PropTypes.object,
  messages: React.PropTypes.object
};

module.exports = CategoriesNewForm;
export default CategoriesNewForm;