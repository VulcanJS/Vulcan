import Telescope from 'meteor/nova:lib';
import NovaForm from "meteor/nova:forms";
import Categories from "meteor/nova:categories";
import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
// import { DocumentContainer } from "meteor/utilities:react-list-container";

class CategoriesEditForm extends Component{

  constructor() {
    super();
    this.deleteCategory = this.deleteCategory.bind(this);
  }

  deleteCategory() {
    const category = this.props.category;
    if (window.confirm(`Delete category “${category.name}”?`)) {
      this.context.actions.call("categories.deleteById", category._id, (error, result) => {
        if (error) {
          this.context.messages.flash(error.message, "error");
        } else {
          this.context.messages.flash(`Category “${category.name}” deleted and removed from ${result} posts.`, "success");
        }
        this.context.closeCallback();
      });
    }
  }

  render() {

    return (
      <div className="categories-edit-form">
        <NovaForm
          document={this.props.category}
          collection={Categories}
          methodName="categories.edit"
          successCallback={(category)=>{
            this.context.messages.flash("Category edited.", "success");
          }}
        />
        <hr/>
        <a onClick={this.deleteCategory} className="categories-delete-link"><Telescope.components.Icon name="close"/> <FormattedMessage id="categories.delete"/></a>
      </div>
    )
  }
}

CategoriesEditForm.propTypes = {
  category: React.PropTypes.object.isRequired
}

CategoriesEditForm.contextTypes = {
  actions: React.PropTypes.object,
  closeCallback: React.PropTypes.func,
  currentUser: React.PropTypes.object,
  messages: React.PropTypes.object,
};

module.exports = CategoriesEditForm;
export default CategoriesEditForm;
