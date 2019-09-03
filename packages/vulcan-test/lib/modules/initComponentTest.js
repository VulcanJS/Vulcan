/**
 * Initialize components
 * Must be called AFTER components registration
 */
import Enzyme from 'enzyme';
// TODO: must be updated depending on the React version
// @see https://www.npmjs.com/package/enzyme-adapter-react-16
import Adapter from 'enzyme-adapter-react-16';

const initComponentTest = () => {
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
