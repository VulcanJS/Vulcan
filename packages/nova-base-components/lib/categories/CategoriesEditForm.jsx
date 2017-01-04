import { Components, registerComponent } from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { intlShape } from 'react-intl';
import SmartForm from "meteor/nova:forms";
import Categories from "meteor/nova:categories";
import { withMessages } from 'meteor/nova:core';

class CategoriesEditForm extends Component{

  render() {

    return (
      <div className="categories-edit-form">
        <SmartForm
          collection={Categories}
          documentId={this.props.category._id}
          successCallback={category => {
            this.context.closeCallback();
            this.props.flash(this.context.intl.formatMessage({id: 'categories.edit_success'}, {name: category.name}), "success");
          }}
          removeSuccessCallback={({documentId, documentTitle}) => {
            this.context.closeCallback();
            this.props.flash(this.context.intl.formatMessage({id: 'categories.delete_success'}, {name: documentTitle}), "success");
            this.context.events.track("category deleted", {_id: documentId});
          }}
          showRemove={true}
        />
      </div>
    )
  }
}

CategoriesEditForm.propTypes = {
  category: React.PropTypes.object.isRequired
}

CategoriesEditForm.contextTypes = {
  intl: intlShape,
  closeCallback: React.PropTypes.func,
};

registerComponent('CategoriesEditForm', CategoriesEditForm, withMessages);
