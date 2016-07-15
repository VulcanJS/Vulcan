import React, { PropTypes, Component } from 'react';
import { FormattedMessage, intlShape } from 'react-intl';
import NovaForm from "meteor/nova:forms";
import { DocumentContainer } from "meteor/utilities:react-list-container";
//import { Messages } from "meteor/nova:core";

class SettingsEditForm extends Component{

  render() {

    return (
      <div className="settings-edit-form">
        <p><FormattedMessage id="settings.json_message"/></p>
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
            successCallback: (category) => {
              this.context.messages.flash(this.context.intl.formatMessage({id: "settings.edited"}), "success");
            }
          }}
        />
      </div>
    )
  }
}

SettingsEditForm.contextTypes = {
  currentUser: React.PropTypes.object,
  messages: React.PropTypes.object,
  intl: intlShape
};

module.exports = SettingsEditForm;
export default SettingsEditForm;