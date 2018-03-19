import { getSetting } from '../modules/settings.js';

const services = getSetting('oAuth');

if (services) {
  _.keys(services).forEach(serviceName => {
    ServiceConfiguration.configurations.upsert({service: serviceName}, {
      $set: services[serviceName]
    });
  });
}
