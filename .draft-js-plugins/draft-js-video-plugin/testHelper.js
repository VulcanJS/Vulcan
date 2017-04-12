import chai from 'chai';
import dirtyChai from 'dirty-chai';
import hook from 'css-modules-require-hook';
import { jsdom } from 'jsdom';

process.env.NODE_ENV = 'test';

hook({
  generateScopedName: '[name]__[local]___[hash:base64:5]',
});

const exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

// chaiEnzyme needs to be initialised here, so that canUseDOM is set
// to true when react-dom initialises (which chai-enzyme depends upon)
const chaiEnzyme = require('chai-enzyme');

chai.use(dirtyChai);
chai.use(chaiEnzyme());
