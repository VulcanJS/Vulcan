import { registerComponent } from 'meteor/vulcan:lib';
import React from 'react';

const wrapper = {
  fontFamily: '"Source Sans", "Helvetica", sans-serif', 
  background: '#F7F6F5',
  position: 'fixed',
  top: 0,
  right: 0,
  left: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const header = {
  textAlign: 'center',
}

const code = {
  border: '1px solid #ccc',
  borderRadius: 3,
  padding: '10px 20px',
  background: 'white',
}

const Welcome = props => 
  <div style={wrapper}>

    <div>
      <h3 style={header}>Welcome to VulcanJS! Create a new index route to get started.</h3>

      <p>1. Create a new <code>route.js</code> file.</p>

      <p>2. Import it into your custom package.</p>

      <p>3. Add the following code:</p>

      <pre style={code}>
        <code dangerouslySetInnerHTML={{__html: `
import { addRoute } from 'meteor/vulcan:core';

addRoute({ name: 'home', path: '/', componentName: 'HelloWorld' });
        `}}/>
      </pre>

    </div>

  </div>

Welcome.displayName = 'Welcome';

registerComponent('Welcome', Welcome);

export default Welcome;