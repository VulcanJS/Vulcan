import { registerCallback } from 'meteor/vulcan:lib';

registerCallback({
    name: 'populate.before',
    description: 'Run before Vulcan objects are populated. Use if you need to add routes dynamically on startup for example.',
    arguments: [],
    runs: 'sync',
    returns: 'nothing',
});