import React, { PropTypes, Component } from 'react';
import NovaForm from "meteor/nova:forms";

import SmartContainers from "meteor/utilities:react-list-container";
const DocumentContainer = SmartContainers.DocumentContainer;

import { Messages } from "meteor/nova:core";

import Actions from "../actions.js";

class CategoriesEditForm extends Component{

  constructor() {
    super();
    this.deleteCategory = this.deleteCategory.bind(this);
  }

  deleteCategory() {
    const category = this.props.category;
    if (window.confirm(`Delete category “${category.name}”?`)) { 
      Actions.call("categories.deleteById", category._id, (error, result) => {
        if (error) {
          Messages.flash(error.message, "error");
        } else {
          Messages.flash(`Category “${category.name}” deleted and removed from ${result} posts.`, "success");
        }
      });
    }
  }

  render() {

    return (
      <div className="categories-edit-form">
        <NovaForm 
          document={this.props.category}
          collection={Categories}
          currentUser={this.context.currentUser}
          methodName="categories.edit"
          successCallback={(category)=>{
            Messages.flash("Category edited.", "success");
          }}
          labelFunction={fieldName => Telescope.utils.getFieldLabel(fieldName, Categories)}
        />
        <hr/>
        <a onClick={this.deleteCategory} className="categories-delete-link"><Telescope.components.Icon name="close"/> Delete Category</a>
      </div>
    )
  }
}

CategoriesEditForm.propTypes = {
  category: React.PropTypes.object.isRequired
}

CategoriesEditForm.contextTypes = {
  currentUser: React.PropTypes.object
};

module.exports = CategoriesEditForm;
export default CategoriesEditForm;