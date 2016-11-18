import { compose } from 'react-apollo'; // note: at the moment, compose@react-apollo === compose@redux ; see https://github.com/apollostack/react-apollo/blob/master/src/index.ts#L4-L7

/**
 * @summary Kick off the global namespace for Telescope.
 * @namespace Telescope
 */

const Telescope = {};

Telescope.VERSION = '0.27.4-nova';

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
  template: Match.Optional(String), // legacy template used to display the field; backward compatibility (not used anymore)
  form: Match.Optional(Object), // form placeholder
  autoform: Match.Optional(Object), // legacy form placeholder; backward compatibility (not used anymore)
  control: Match.Optional(Match.Any), // NovaForm control (String or React component)
  order: Match.Optional(Number), // position in the form
  group: Match.Optional(Object) // form fieldset group
});

// ------------------------------------- Components -------------------------------- //

Telescope.components = {};

/**
 * Register a Telescope component with a name, a raw component than can be extended
 * and one or more optional higher order components.
 *
 * @param {String} name The name of the component to register.
 * @param {React Component} rawComponent Interchangeable/extendable component.
 * @param {...Function} hocs The HOCs to compose with the raw component.
 * @returns {Function|React Component} A component callable with Telescope.components[name]
 *
 * Note: when a component is registered without higher order component, `hocs` will be
 * an empty array, and it's ok! 
 * See https://github.com/reactjs/redux/blob/master/src/compose.js#L13-L15
 */
Telescope.registerComponent = (name, rawComponent, ...hocs) => {
  // console.log('// registering component');
  // console.log(name);
  // console.log('raw component', rawComponent);
  // console.log('higher order components', hocs); 

  // note: maybe do something to replace connect at the right place, see https://github.com/apollostack/react-apollo/issues/315

  // compose the raw component with the HOCs given in option
  Telescope.components[name] = compose(...hocs)(rawComponent);

  // keep track of the raw component & hocs, so we can extend the component if necessary
  Telescope.components[name].rawComponent = rawComponent;
  Telescope.components[name].hocs = hocs;

  return Telescope.components[name];
};

/**
 * Get a component registered with Telescope.registerComponent(name, component, ...hocs).
 *
 * @param {String} name The name of the component to get.
 * @returns {Function|React Component} A (wrapped) React component
 */
Telescope.getComponent = (name) => {
  return Telescope.components[name];
};

/**
 * Get the **raw** (original) component registered with Telescope.registerComponent
 * without the possible HOCs wrapping it.
 *
 * @param {String} name The name of the component to get.
 * @returns {Function|React Component} An interchangeable/extendable React component
 */
Telescope.getRawComponent = (name) => {
  return Telescope.components[name].rawComponent;
};

/**
 * Replace a Telescope component with the same name with a new component or 
 * an extension of the raw component and one or more optional higher order components.
 * This function keeps track of the previous HOCs and wrap the new HOCs around previous ones
 *
 * @param {String} name The name of the component to register.
 * @param {React Component} rawComponent Interchangeable/extendable component.
 * @param {...Function} hocs The HOCs to compose with the raw component.
 * @returns {Function|React Component} A component callable with Telescope.components[name]
 *
 * Note: when a component is registered without higher order component, `hocs` will be
 * an empty array, and it's ok! 
 * See https://github.com/reactjs/redux/blob/master/src/compose.js#L13-L15
 */
Telescope.replaceComponent = (name, newComponent, ...newHocs) => {
  const previousComponent = Telescope.components[name];
  
  // xxx : throw an error if the previous component doesn't exist

  // console.log('// replacing component');
  // console.log(name);
  // console.log(newComponent);
  // console.log('new hocs', newHocs);
  // console.log('previous hocs', previousComponent.hocs);

  return Telescope.registerComponent(name, newComponent, ...newHocs, ...previousComponent.hocs);  
}

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

// ---------------------------------- Redux ------------------------------------ //
Telescope.actions = {};
Telescope.reducers = {};

export default Telescope;