import { getSetting } from '../modules/settings';
import { addCallback } from '../modules/callbacks';

const database = getSetting('database', 'mongo');

export const DatabaseConnectors = {};

export let Connectors = {};

function initializeConnectors () {
  Connectors = DatabaseConnectors[database];
}

addCallback('app.startup', initializeConnectors);