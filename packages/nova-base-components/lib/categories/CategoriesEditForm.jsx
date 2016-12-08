import { Components, registerComponent } from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import NovaForm from "meteor/nova:forms";
import Categories from "meteor/nova:categories";
import { withMessages } from 'meteor/nova:core';

class CategoriesEditForm extends Component{

  render() {

    return (
      <div className="categories-edit-form">
        <NovaForm
          collection={Categories}
          documentId={this.props.category._id}
          successCallback={category => {
            this.context.closeCallback();
            this.props.flash("Category edited.", "success");
          }}
          removeSuccessCallback={({documentId, documentTitle}) => {
            this.context.closeCallback();
            const deleteDocumentSuccess = this.context.intl.formatMessage({id: 'categories.delete_success'}, {title: documentTitle});
            this.props.flash(deleteDocumentSuccess, "success");
            this.context.events.track("category deleted", {_id: documentId});
          }}
        />
      </div>
    )
  }
}

CategoriesEditForm.propTypes = {
  category: React.PropTypes.object.isRequired
}

CategoriesEditForm.contextTypes = {
  closeCallback: React.PropTypes.func,
};

registerComponent('CategoriesEditForm', CategoriesEditForm, withMessages);
