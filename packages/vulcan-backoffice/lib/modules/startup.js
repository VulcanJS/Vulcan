/**
 * Generate the backoffice on startup
 */
import { getSetting, Collections } from 'meteor/vulcan:core'
import setupBackoffice from './setupBackoffice'

const enabled = getSetting('backoffice.enabled', Meteor.isDevelopment)

if (enabled) {
    Meteor.startup(() => {
        // const providedOptions = runCallbacks('backoffice.options')
        // const collectionOptions = runCallbacks('backoffice.collectionOptions')
        setupBackoffice(Collections)
    })
}
