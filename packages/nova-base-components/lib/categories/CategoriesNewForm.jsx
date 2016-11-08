import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import Categories from "meteor/nova:categories";
import NovaForm from "meteor/nova:forms";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import update from 'immutability-helper';

const CategoriesNewForm = (props, context) => {

  return (
    <div className="categories-new-form">
      <NovaForm 
        collection={Categories} 
        mutationName="categoriesNew"
        resultQuery={Categories.graphQLQueries.single}
        updateQueries={{
          getAppData: (prev, {mutationResult}) => {
            const newCategory = mutationResult.data.categoriesNew;
            const newCategoriesList = update(prev, {
              categories: {
                $push: [newCategory]
              }
            });
            return newCategoriesList;
          },
        }}
        successCallback={(category)=>{
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
  currentUser: React.PropTypes.object,
};

const mapStateToProps = state => ({ messages: state.messages, });
const mapDispatchToProps = dispatch => bindActionCreators(Telescope.actions.messages, dispatch);

module.exports = connect(mapStateToProps, mapDispatchToProps)(CategoriesNewForm);
export default connect(mapStateToProps, mapDispatchToProps)(CategoriesNewForm);