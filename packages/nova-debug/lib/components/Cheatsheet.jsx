import React from 'react';
import Posts from "meteor/vulcan:posts";
import Comments from "meteor/vulcan:comments";
import Users from 'meteor/vulcan:users';
import { Callbacks, Utils, registerComponent } from 'meteor/vulcan:core';


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
          <ul>
            {_.map(Users.is, renderFunction)}
          </ul>
        </div>

        <div className="cheatsheet-block">
          <h2>Posts</h2>
          <h3>Helpers (<code>Posts.*</code>)</h3>
          <ul>
            {_.map(Posts, (item, key) => (key[0] !== "_" ? renderFunction(item, key) : null) )}
          </ul>
        </div>
        
        <div className="cheatsheet-block">
          <h2>Comments</h2>
          <h3>Helpers (<code>Comments.*</code>)</h3>
          <ul>
            {_.map(Comments, (item, key) => (key[0] !== "_" ? renderFunction(item, key) : null) )}
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
          <h3>Hooks (<code>Callbacks.*</code>)</h3>
          <ul>
            {_.map(Callbacks, renderCallback)}
          </ul>
        </div>

        <div className="cheatsheet-block">
          <h2>Utils</h2>
          <h3>Helpers (<code>Utils.*</code>)</h3>
          <ul>
            {_.map(Utils, renderFunction)}
          </ul>
        </div>

      </div>
    
    </div>
  )
}

registerComponent('Cheatsheet', Cheatsheet);
