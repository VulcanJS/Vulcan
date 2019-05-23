/**
 * Initialize components
 * Must be called AFTER components registration
 */
// setup JSDOM server side for testing (necessary for Enzyme to mount)
import jsdom from 'jsdom-global';
import Enzyme from 'enzyme';
// TODO: must be updated depending on the React version
// @see https://www.npmjs.com/package/enzyme-adapter-react-16
import Adapter from 'enzyme-adapter-react-16.3';

const initComponentTest = () => {
  // init a JSDOM to allow rendering server side
  jsdom("", {
		runScripts: "outside-only"
	});
  // setup enzyme
  Enzyme.configure({ adapter: new Adapter() });
  //
  // and then load them in the app so that <Component.Whatever /> is defined
  import { populateComponentsApp, initializeFragments } from 'meteor/vulcan:lib';
  // we need registered fragments to be initialized because populateComponentsApp will run
  // hocs, like withUpdate, that rely on fragments
  initializeFragments();
  // actually fills the Components object
  populateComponentsApp();
};
export default initComponentTest;
