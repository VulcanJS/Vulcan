import React from 'react';
import NovaForm from "meteor/nova:forms";

const renderSetting = (field, key) => {
    return (
        <tr key={key}>
            <td><code>{key}</code></td>
            <td>{field.type && field.type.name}</td>
            <td>{field.private ? <span className="private">private</span> : Telescope.settings.get(key)}</td>
            <td>{field.defaultValue && field.defaultValue.toString()}</td>
            <td>{field.autoform && field.autoform.instructions}</td>
        </tr>
    )
}

const SettingsPage = () => {

    ({IsAdmin} = Telescope.components);

    return (
        <IsAdmin user={Meteor.user()}>
            <div className="edit-user-form">
                <h1>Settings</h1>
                <NovaForm currentUser={Meteor.users}
                      collection={Telescope.settings.collection}/>
            </div>
        </IsAdmin>
    )
}

module.exports = SettingsPage
export default SettingsPage
