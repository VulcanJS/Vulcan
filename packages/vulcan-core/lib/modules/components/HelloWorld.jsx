import { registerComponent } from 'meteor/vulcan:lib';
import React from 'react';
import PropTypes from 'prop-types';

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
};

const header = {
  textAlign: 'center',
};

const code = {
  border: '1px solid #ccc',
  borderRadius: 3,
  padding: '10px 20px',
  background: 'white',
};

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
 }

const HelloWorld = props => 
  <div style={wrapper}>

    <div>
      <h3 style={header}>Well Done! Now replace this with your own component</h3>

      <p>1. Create a new <code>components/Home.jsx</code> file.</p>

      <p>2. Import it into your custom package.</p>

      <p>3. Add the following code:</p>

      <pre style={code}>
        <code dangerouslySetInnerHTML={{__html: escapeHtml(`
import { registerComponent } from 'meteor/vulcan:core';
import React from 'react';

const Home = props => 
  <div>
    <h3>Welcome Home!</h3>
  </div>

registerComponent('Home', Home);
        `)}}/>
      </pre>

      <p>4. Update your route:</p>

      <pre style={code}>
        <code dangerouslySetInnerHTML={{__html: `
import { addRoute } from 'meteor/vulcan:core';

addRoute({ name: 'home', path: '/', componentName: 'Home' });
        `}}/>
      </pre>

    </div>

  </div>;

HelloWorld.displayName = 'HelloWorld';

registerComponent('HelloWorld', HelloWorld);

export default HelloWorld;