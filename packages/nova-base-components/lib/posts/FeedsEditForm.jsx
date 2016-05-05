import React, { PropTypes, Component } from 'react';
import NovaForm from "meteor/nova:forms";

import SmartContainers from "meteor/utilities:react-list-container";
const ListContainer = SmartContainers.ListContainer;

import Core from "meteor/nova:core";
const Messages = Core.Messages;

class FeedsEditForm extends Component {

  render() {

    ({FeedsList} = Telescope.components);

    return (
      <div className="feeds-edit-form">
        <p>Add a new feed:</p>
        <NovaForm
          collection={Feeds}
          currentUser={this.context.currentUser}
          methodName="feeds.new"
          successCallback={() => {
            Messages.flash("Feed added.", "success");
          }}
          labelFunction={(fieldName)=>Telescope.utils.getFieldLabel(fieldName, Feeds)}
        />
        <ListContainer
          collection={Feeds}
          publication="feeds.list"
          selector={{}}
          terms={{}}
          joins={Feeds.getJoins()}
          component={FeedsList}
          cacheSubscription={false}
        />
      </div>
    );
  }
}

FeedsEditForm.contextTypes = {
  currentUser: React.PropTypes.object
};

module.exports = FeedsEditForm;
export default FeedsEditForm;