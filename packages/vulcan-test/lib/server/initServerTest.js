/**
 * Enable server side tests
 */
import { runCallbacks } from 'meteor/vulcan:lib';

export default ( )=> {
    runCallbacks('app.startup');
};