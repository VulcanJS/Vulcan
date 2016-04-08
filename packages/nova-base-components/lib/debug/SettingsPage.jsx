import React from 'react';
import NovaForm from "meteor/nova:forms";

import Core from "meteor/nova:core";
const Messages = Core.Messages;

const SettingsPage = ({document, currentUser}) => {

    ({IsAdmin} = Telescope.components);

    return (
        <div className="container-fluid">
            <IsAdmin user={currentUser}>
                <div className="edit-user-form">
                    <h1>Settings</h1>
                    <NovaForm collection={Telescope.settings.collection}
                              methodName="settings.insert"
                              successCallback={(post)=>{
                                Messages.flash("Post created.", "success");
                              }}/>
                </div>
            </IsAdmin>
        </div>
    )
}

module.exports = SettingsPage;
export default SettingsPage;
