# vulcan:subscribe

This optional package for Vulcan lets your users subscribe to the different domains (collections) of your application.

### Dependencies & usage
Explicit dependency on `vulcan:users` to enable permissions.

If `vulcan:posts` is enabled, your users will be able to subscribe to:
* new posts from users they follow (subscribed to)
* new comments on a post they are subscribed to

If `vulcan:categories` is enabled, your users will be able to subscribe to new posts in a category.

### Basic usage

This package gives you access to several methods of the type `collection.subscribe` & `collection.unsubscribe`. Default group of users can subscribe to any activated domain (see above) with the following methods (action) :
```
users.subscribe
users.unsubscribe
posts.subscribe
posts.unsubscribe
categories.subscribe
categories.unsubscribe
```

This package also provides a reusable component called `SubscribeTo` to subscribe to an document of collection.

This component takes the `document` as a props. It can trigger any method described below:

```jsx
// for example, in PostItem.jsx
<Components.SubscribeTo document={post} />

// for example, in UsersProfile.jsx
<Components.SubscribeTo document={user} />

// for example, in Category.jsx
<Components.SubscribeTo document={category} />
```

### Extend to other collections than Users, Posts, Categories
This package export a function called `subscribMutationsGenerator` that takes a collection as an argument and create the associated methods code :

```js
// in my custom package
import subscribMutationsGenerator from 'meteor/vulcan:subscribe';
import Movies from './collection.js';

// the function creates the code and give it to the graphql server
subscribMutationsGenerator(Movies); 
```

This will creates for you the mutations `moviesSubscribe` & `moviesUnsubscribe` than can be used in the `SubscribeTo` component: 
```jsx
// in my custom component
<Components.SubscribeTo document={movie} />
```

You'll also need to write the relevant callbacks, custom fields & permissions to run whenever a user is subscribed to your custom collection's item. See these files for inspiration.
*Note: it's more or less always the same thing*

* Custom fields: https://github.com/TelescopeJS/Telescope/blob/devel/packages/vulcan-subscribe/lib/custom_fields.js#L47-L75
* Callbacks: https://github.com/TelescopeJS/Telescope/blob/devel/packages/vulcan-subscribe/lib/callbacks.js#L13-L36
* Permissions: https://github.com/TelescopeJS/Telescope/blob/devel/packages/vulcan-subscribe/lib/permissions.js

### Reusable component to show a list of subscribed items

There was formerly a component that showed a list of subscribed posts. While reducing the depencies to other packages, it broke. It's on the roadmap to re-enable it. Feel free to discuss about it [on the Slack channel](http://slack.telescopeapp.org/) if you want to build it!

![Subscribe all the things](https://cdn.meme.am/instances/500x/70780773.jpg)

Original PR & discussion can be found here: https://github.com/TelescopeJS/Telescope/pull/1425
