/**
 * @summary Kick off the global namespace for Telescope.
 * @namespace Telescope
 */

Telescope = {};

Telescope.VERSION = '0.26.5-nova';

// ------------------------------------- Config -------------------------------- //

/**
 * @summary Telescope configuration namespace
 * @namespace Telescope.config
 */
Telescope.config = {};


// ------------------------------------- Schemas -------------------------------- //

SimpleSchema.extendOptions({
  private: Match.Optional(Boolean),
  editable: Match.Optional(Boolean),  // editable: true means the field can be edited by the document's owner
  hidden: Match.Optional(Boolean),     // hidden: true means the field is never shown in a form no matter what
  required: Match.Optional(Boolean), // required: true means the field is required to have a complete profile
  profile: Match.Optional(Boolean), // profile: true means the field is shown on user profiles
  template: Match.Optional(String), // template used to display the field
  autoform: Match.Optional(Object), // autoform placeholder
  control: Match.Optional(Match.Any), // NovaForm control (String or React component)
  order: Match.Optional(Number), // position in the form
  group: Match.Optional(Object) // form fieldset group
});

// ------------------------------------- Components -------------------------------- //

Telescope.components = {};

Telescope.registerComponent = (name, component) => {
  Telescope.components[name] = component;
};

Telescope.getComponent = (name) => {
  return Telescope.components[name];
};

// ------------------------------------- Subscriptions -------------------------------- //

 /**
 * @summary Subscriptions namespace
 * @namespace Telescope.subscriptions
 */
Telescope.subscriptions = [];

/**
 * @summary Add a subscription to be preloaded
 * @param {string} subscription - The name of the subscription
 */
Telescope.subscriptions.preload = function (subscription, args) {
  Telescope.subscriptions.push({name: subscription, arguments: args});
};

// ------------------------------------- Strings -------------------------------- //

Telescope.strings = {};

// ------------------------------------- Routes -------------------------------- //

Telescope.routes = {
  routes: [],
  add(routeOrRouteArray) {
    const addedRoutes = Array.isArray(routeOrRouteArray) ? routeOrRouteArray : [routeOrRouteArray];
    this.routes = this.routes.concat(addedRoutes);
  }
}

// ------------------------------------- Head Tags -------------------------------- //

Telescope.headtags = {
  meta: [],
  link: []
}

// ------------------------------------- Statuses -------------------------------- //

Telescope.statuses = [
  {
    value: 1,
    label: 'pending'
  },
  {
    value: 2,
    label: 'approved'
  },
  {
    value: 3,
    label: 'rejected'
  },
  {
    value: 4,
    label: 'spam'
  },
  {
    value: 5,
    label: 'deleted'
  }
];

export default Telescope;