Server-side rendering for react-router and react-meteor-data rehydratating Meteor subscriptions

It has a protection against leaking your data. Only subscribed data will be available just the way it would be on the client.

What about your SEO? Just `npm install react-helmet` and hook it with `htmlHook(html): string` (see the example below).

## Install
`meteor add reactrouter:react-router-ssr`

## Usage
### `ReactRouterSSR.Run(routes, [clientOptions], [serverOptions])`
The `routes` argument takes the routes you want react-router to use (you don't have to call `ReactDOM.render()` yourself)<br />
Read the [react-router documentation](https://github.com/rackt/react-router/tree/master/docs) for more informations.

#### routes
Your main `<Route />` node of your application.<br />
**Notice that there is no `<Router />` element, ReactRouterSSR takes care of creating it on the client and server with the correct parameters**

#### clientOptions (optional)
- `historyHook`: [function(history) : newHistory] - Hook something into history client side.
- `props` [object]: The additional arguments you would like to give to the `<Router />` component on the client.
- `wrapperHook` [function(App) : Component]: You can wrap the react-router element with your own providers.
- `rehydrateHook` [function(data)]: Receive the rehydrated object that was dehydrated during server side rendering.
- `rootElement` [string]: The root element ID your React application is mounted with (defaults to `react-app`)
- `rootElementType` [string]: Set the root element type (defaults to `div`)
- `rootElementAttributes`[array]: Set the root element attributes as an array of tag-value pairs. I.e. `[['class', sidebar main], ['style', 'background-color: white']]`

#### serverOptions (optional)
- `props` [object]: The additional arguments you would like to give to the `<Router />` component on the server.
- `htmlHook` [function(html) : newHtml]: Prepare the HTML before sending it to the client
- `historyHook` [function(history): newHistory]: Hook something on the history server side.
- `dehydrateHook` [function() : data]: Supply data that should be dehydrated and sent to client.
- `fetchDataHook` [function(components) : Array<Promise>]: Trigger the fetchData on your components that have it
- `preRender` [function(req, res)]: Executed just before the renderToString
- `postRender` [function(req, res)]: Executed just after the renderToString
- `dontMoveScripts` [bool]: Keep the script inside the head tag instead of moving it at the end of the body
- `disableSSR` [bool]: Disable server-side rendering, in case the application depends on code which doesn't work on the server.
- `loadingScreen` [string]: An HTML string to display while the page renders, in case the `disableSSR` option is set to true.

### Scripts
Unless you disabled it, the scripts yo have in the header will be moved down at the end of the body tag.

To keep a particuliar code in the head, you can add the `data-dont-move` attribute like this:

```html
<script data-dont-move>/* I'll stay in the head tag! */</script>
```

## Simple Example
```javascript
import React, { Component } from 'react';
import ReactMixin from 'react-mixin';
import { IndexRoute, Route } from 'react-router';
import { ReactRouterSSR } from 'meteor/reactrouter:react-router-ssr';

AppRoutes = (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="login" component={LoginPage} />
    <Route path="*" component={NotFoundPage} />
    {/* ... */}
  </Route>
);

@ReactMixin(ReactMeteorData)
export default class HomePage extends Component
  getMeteorData() {
    Meteor.subscribe('profile');

    return {
      profile: Profile.findOne({ user: Meteor.userId() })
    };
  },

  render() {
    return <div>Hi {profile.name}</div>;
  }
});

ReactRouterSSR.Run(AppRoutes);
```

## Complex Example
```javascript
import { IndexRoute, Route } from 'react-router';
import ReactHelmet from 'react-helmet';
import ReactCookie from 'react-cookie';

AppRoutes = (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="login" component={LoginPage} />
    <Route path="*" component={NotFoundPage} />
    {/* ... */}
  </Route>
);

ReactRouterSSR.Run(AppRoutes, {
  props: {
    onUpdate() {
      // Notify the page has been changed to Google Analytics
      ga('send', 'pageview');
    },
  }
}, {
  htmlHook(html) {
    const head = ReactHelmet.rewind();
    return html.replace('<head>', '<head>' + head.title + head.base + head.meta + head.link + head.script);
  },
  preRender: function(req, res) {
    ReactCookie.plugToRequest(req, res);
  }
});

if (Meteor.isClient) {
  // Load Google Analytics
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-XXXXXXXX-X', 'auto');
  ga('send', 'pageview');
}
```

## Example with Redux

ReactRouterSSR supports applications that use Redux, using the `rehydrateHook` and `dehydrateHook` options in clientOptions and serverOptions respectively.

```javascript
import React from 'react';
import { Provider } from 'react-redux';

import routes from './routes';
import configureStore from './store';

// Data that is populated by hooks during startup
let history;
let store;
let initialState;

// Use history hook to get a reference to the history object
const historyHook = newHistory => history = newHistory;

// Pass the state of the store as the object to be dehydrated server side
const dehydrateHook = () => store.getState();

// Take the rehydrated state and use it as the initial state client side
const rehydrateHook = state => initialState = state;

// Create a redux store and pass into the redux Provider wrapper
const wrapperHook = app => {
  store = configureStore(initialState, history);
  return <Provider store={store}>{app}</Provider>;
}

const clientOptions = { historyHook, rehydrateHook, wrapperHook };
const serverOptions = { historyHook, dehydrateHook };

ReactRouterSSR.Run(routes, clientOptions, serverOptions);
```

### Client-side data rehydration
ReactRouterSSR provides hooks to make use of client-side data rehydration:

- On server side, once rendering is done, the data returned from dehydrateHook is serialized (using `JSON.stringify()`) and sent to the client as part of the generated HTML.
- On the client side, that serialized data is rehydrated and passed to the client via rehydrateHook.

#### Data serialization
The `JSON.stringify()` serialization means that, if your data holds "rich" domain objects with methods attached though prototypes or ES6 classes (for example documents fetched from Mongo collections with an associated transform, or [ImmutableJS](https://facebook.github.io/immutable-js) structures...), the client receives them downcasted to Plain Old Javascript Objects (without prototypes or methods) in the 'data'.

It is then the responsibility of the client code to "upcast" them back to the expected domain objects. In the case of redux it is recommended to handle that in each of the relevant reducers, by taking advantage of the fact that redux's `createStore()` dispatches an internal action with the 'initialState' it has been passed (which, in our case, is the unserialized state coming from the server rendering.)

For example:

- for a reducer that stores a document read from a collection that has a transform attached :
```js
function myReducer(state = {}, action) {
  // If needed, upcast the raw state passed by the server SSR.
  if (typeof state.expectedHelper === 'undefined') { // Or some other check for MyDomainClass ?
    state = transform(state); // Where transform is the same transform you assigned to your collection
  }
  // Then the usual action matching :
  switch (action.type) {
    ... return state;
  }
}
```
- for a reducer that stores ImmutableJS structures, [redux-immutablejs](https://github.com/indexiatech/redux-immutablejs)'s createReducer() helper accepts an optional 'constructor' argument that does exactly that (defaults to `Immutable.fromJS()`).

### Server-side pre-render data fetching (optional)
On the server-side, ReactRouterSSR implements the "fetchData" mechanism mentioned at the bottom of [the Redux doc on Server-Side Rendering](http://rackt.org/redux/docs/recipes/ServerRendering.html):

The route components (e.g. `App`, `HomePage`, `LoginPage`... in the example above) can optionally specify a static fetchData() method to pre-populate the store with external data before rendering happens.
That fetchData() method, if present, will be automatically called for the components of the matched route (e.g. on `App` and `HomePage` for the url `'/'` in the example above).

The fetchData() method receives:

- the store's `getState` function,
- the store's `dispatch` function,
- the routing props for the resolved route (notably including `location` and `params`)

and can dispatch async actions for external data fetching, returning the corresponding Promise. Rendering is then deferred until all Promises are resolved.
