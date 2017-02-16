const services = Meteor.settings.oAuth;

if (services) {
  _.keys(services).forEach(serviceName => {
    ServiceConfiguration.configurations.upsert({service: serviceName}, {
      $set: services[serviceName]
    });
  });
}
