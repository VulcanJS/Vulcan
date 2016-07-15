import React from 'react';
import Posts from "meteor/nova:posts";
import Comments from "meteor/nova:comments";
import Users from 'meteor/nova:users';

const methodList = Meteor.isServer ? Meteor.server.method_handlers : Meteor.connection._methodHandlers;

const renderFunction = (func, name) => {
  const s = func.toString();
  const openParen = s.indexOf("(");
  const closeParen = s.indexOf(")");
  return (
    <li key={name}>
      <code>{name}({s.substr(openParen+1, closeParen-openParen-1)})</code>
    </li>
  )
}

const renderCallback = (callbacks, key) => {
  if (Array.isArray(callbacks)) {
    return (
      <div className="callbacks" key={key}>
        <h4>{key}</h4>
        <ul>
          {_.map(callbacks, (item, key) => <li key={key}><code>{item.name}</code></li>)}
        </ul>
      </div>
    )
  } else {
    return null
  }
}

const Cheatsheet = props => {
  return (
    <div className="cheatsheet">
      <h1>Cheatsheet</h1>

      <div className="cheatsheet-wrapper">

        <div className="cheatsheet-block">
          <h2>Users</h2>
          <h3>Helpers (<code>Users.*</code>)</h3>
          <ul>
            {_.map(Users, (item, key) => (key[0] !== "_" ? renderFunction(item, key) : null) )}
          </ul>
          <h3>Permissions (<code>Users.can.*</code>)</h3>
          <ul>
            {_.map(Users.can, renderFunction)}
          </ul>
          <h3>Roles (<code>Users.is.*</code>)</h3>
          <ul>
            {_.map(Users.is, renderFunction)}
          </ul>
          <h3>Methods</h3>
          <ul>
            {_.map(methodList, (item, key) => (key.indexOf("users.") !== -1 ? renderFunction(item, key) : null))}
          </ul>
        </div>

        <div className="cheatsheet-block">
          <h2>Posts</h2>
          <h3>Helpers (<code>Posts.*</code>)</h3>
          <ul>
            {_.map(Posts, (item, key) => (key[0] !== "_" ? renderFunction(item, key) : null) )}
          </ul>
          <h3>Methods</h3>
          <ul>
            {_.map(methodList, (item, key) => (key.indexOf("posts.") !== -1 ? renderFunction(item, key) : null))}
          </ul>
        </div>
        
        <div className="cheatsheet-block">
          <h2>Comments</h2>
          <h3>Helpers (<code>Comments.*</code>)</h3>
          <ul>
            {_.map(Comments, (item, key) => (key[0] !== "_" ? renderFunction(item, key) : null) )}
          </ul>
          <h3>Methods</h3>
          <ul>
            {_.map(methodList, (item, key) => (key.indexOf("comments.") !== -1 ? renderFunction(item, key) : null))}
          </ul>
        </div>

        <div className="cheatsheet-block">
          <h2>Callbacks</h2>
          <h3>Functions</h3>
          <ul>
            <li><code>add()</code></li>
            <li><code>remove()</code></li>
            <li><code>run()</code></li>
            <li><code>runAsync()</code></li>
          </ul>
          <h3>Hooks (<code>Telescope.callbacks.*</code>)</h3>
          <ul>
            {_.map(Telescope.callbacks, renderCallback)}
          </ul>
        </div>

        <div className="cheatsheet-block">
          <h2>Utils</h2>
          <h3>Helpers (<code>Telescope.utils.*</code>)</h3>
          <ul>
            {_.map(Telescope.utils, renderFunction)}
          </ul>
        </div>

      </div>
    
    </div>
  )
}

module.exports = Cheatsheet
export default Cheatsheet