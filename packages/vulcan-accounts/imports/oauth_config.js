import { getSetting } from 'meteor/vulcan:lib';

const services = getSetting('oAuth');

if (services) {
  Object.keys(services).forEach(serviceName => {
    ServiceConfiguration.configurations.upsert({service: serviceName}, {
      $set: services[serviceName]
    });
  });
}
