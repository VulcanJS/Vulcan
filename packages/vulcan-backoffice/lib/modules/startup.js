/**
 * Generate the backoffice on startup
 */
import { getSetting, Collections } from 'meteor/vulcan:core'
import setupBackoffice from './setupBackoffice'
import { devOptions } from './options'

const enabled = getSetting('backoffice.enabled', Meteor.isDevelopment)

if (enabled) {
    const options = Meteor.isDevelopment ? devOptions : undefined // loose permissions during development
    // const providedOptions = runCallbacks('backoffice.options')
    // const collectionOptions = runCallbacks('backoffice.collectionOptions')
    setupBackoffice(Collections, options)
}
