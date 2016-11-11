import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import NovaForm from "meteor/nova:forms";
import Categories from "meteor/nova:categories";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

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
          this.props.flash(error.message, "error");
        } else {
          this.props.flash(`Category “${category.name}” deleted and removed from ${result} posts.`, "success");
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
          mutationName="categoriesEdit"
          // resultQuery={Categories.graphQLQueries.single}
          fragment={Categories.fragments.full}
          successCallback={(category)=>{
            this.context.closeCallback();
            this.props.flash("Category edited.", "success");
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
};

const mapStateToProps = state => ({ messages: state.messages, });
const mapDispatchToProps = dispatch => bindActionCreators(Telescope.actions.messages, dispatch);

module.exports = connect(mapStateToProps, mapDispatchToProps)(CategoriesEditForm);
export default connect(mapStateToProps, mapDispatchToProps)(CategoriesEditForm);