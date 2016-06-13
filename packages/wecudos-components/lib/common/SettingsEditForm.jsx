import React, { PropTypes, Component } from 'react';
import NovaForm from "meteor/nova:forms";

import SmartContainers from "meteor/utilities:react-list-container";
const DocumentContainer = SmartContainers.DocumentContainer;

import Core from "meteor/nova:core";
const Messages = Core.Messages;

class SettingsEditForm extends Component{

  render() {

    return (
      <div className="edit-post-form">
        <p>Note: settings already provided in your <code>settings.json</code> file will be disabled.</p>
        <DocumentContainer 
          collection={Telescope.settings.collection} 
          publication="settings.admin" 
          selector={{}}
          terms={{}}
          component={NovaForm}
          componentProps={{
            // note: the document prop will be passed from DocumentContainer
            collection: Telescope.settings.collection,
            currentUser: this.context.currentUser,
            methodName: "settings.edit",
            successCallback: (category)=>{
              Messages.flash("Settings edited (please reload).", "success");
            },
            labelFunction: fieldName => Telescope.utils.getFieldLabel(fieldName, Telescope.settings.collection)
          }}
        />
      </div>
    )
  }
}

SettingsEditForm.contextTypes = {
  currentUser: React.PropTypes.object
};

module.exports = SettingsEditForm;
export default SettingsEditForm;