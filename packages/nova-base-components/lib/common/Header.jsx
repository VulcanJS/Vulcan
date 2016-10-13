import Telescope from 'meteor/nova:lib';
import React from 'react';
//import { Messages } from "meteor/nova:core";

const Header = ({currentUser}) => {
  
  const logoUrl = Telescope.settings.get("logoUrl");
  const siteTitle = Telescope.settings.get("title", "Nova");
  const tagline = Telescope.settings.get("tagline");
  const notes = currentUser ? currentUser.telescope :  {};
  const notifications = !_.isEmpty(notes) && _.has(notes,'notifications') ? notes.notifications : [];
  
  return (
    <div className="header-wrapper">

      <header className="header">

        <div className="logo">
          <Telescope.components.Logo logoUrl={logoUrl} siteTitle={siteTitle} />
          {tagline ? <h2 className="tagline">{tagline}</h2> : "" }
        </div>
        
        <div className="nav">
          
          <div className="nav-user">
            {currentUser ? <Telescope.components.UsersMenu user={currentUser}/> : <Telescope.components.UsersAccountMenu/>}
          </div>
          
          <div className="menu notification text-center hidden-sm-down" onClick={function(e){$("#notificationsList").toggle()}} >
            <h4>{notifications.length ? notifications.length : ""} Notifications</h4>
            <ul id="notificationsList">
              {notifications.map( (note,index) => {
                return <li id={"note_"+index} bsStyle="info" key={index} href={note.link} onClick={function(e){               
                Meteor.call('sawNotification', note.link, function(error, result) {
                  console.log(error,result)
                  //to do handle this a better way? instead of remove it ?
                  //check the sawNotification method on the server notification package lib/server
                  // $("#note_"+index).remove();
                });
                
                  return false;
                }} >
                {note.name}
                </li>
              })}
            </ul>
          </div>
          
          <div className="nav-new-post">
            <Telescope.components.PostsNewButton/>
          </div>

        </div>

      </header>
    </div>
  )
}

Header.displayName = "Header";

module.exports = Header;
