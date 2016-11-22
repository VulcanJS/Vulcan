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
        // fragment={Categories.fragments.list}
        updateQueries={{
          getCategoriesList: (prev, {mutationResult}) => {
            const newCategory = mutationResult.data.categoriesNew;
            const newCategoriesList = update(prev, {
              categoriesList: {
                $push: [newCategory]
              },
              categoriesListTotal: {
                $set: prev.categoriesListTotal + 1
              },
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
};

const mapStateToProps = state => ({ messages: state.messages, });
const mapDispatchToProps = dispatch => bindActionCreators(Telescope.actions.messages, dispatch);

Telescope.registerComponent('CategoriesNewForm', CategoriesNewForm, connect(mapStateToProps, mapDispatchToProps));