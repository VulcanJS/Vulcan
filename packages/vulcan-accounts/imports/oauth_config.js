import { getSetting } from 'meteor/vulcan:lib';
import ServiceConfiguration from 'meteor/service-configuration';

const services = getSetting('oAuth');

if (services) {
  Object.keys(services).forEach(serviceName => {
    ServiceConfiguration.configurations.upsert({service: serviceName}, {
      $set: services[serviceName]
    });
  });
}
