# nova:subscribe

This optional package for Nova lets your users subscribe to the different domains (collections) of your application.

### Dependencies & usage
Explicit dependency on `nova:users` to enable permissions.

If `nova:posts` is enabled, your users will be able to subscribe to:
* new posts from users they follow (subscribed to)
* new comments on a post they are subscribed to

If `nova:categories` is enabled, your users will be able to subscribe to new posts in a category.

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

This component takes two props, `document` & `documentType`. It can trigger any method described below:

```jsx
// for example, in PostItem.jsx
<Telescope.components.SubscribeTo document={post} documentType={"posts"} />

// for example, in UsersProfile.jsx
<Telescope.components.SubscribeTo document={user} documentType={"users"} />

// for example, in Category.jsx
<Telescope.components.SubscribeTo document={category} documentType={"categories"} />
```

### Extend to other collections than Users, Posts, Categories
This package export a function called `subscribeMethodsGenerator` that takes a collection as an argument and create the associated methods code :

```js
// in my custom package
import subscribeMethodsGenerator from 'meteor/nova:subscribe';
import Movies from './collection.js';

// the function creates the code, then you have to associate it to the Meteor namespace:
Meteor.methods(subscribeMethodsGenerator(Movies)); 
```

This will creates for you the methods `movies.subscribe` & `movies.unsubscribe` than can be used in the `SubscribeTo` component: 
```jsx
// in my custom component
<Telescope.components.SubscribeTo document={movie} documentType={"movies"} />
```

You'll also need to write the relevant callbacks, custom fields & permissions to run whenever a user is subscribed to your custom collection's item. See these files for inspiration.
*Note: it's more or less always the same thing*

* Custom fields: https://github.com/TelescopeJS/Telescope/blob/devel/packages/nova-subscribe/lib/custom_fields.js#L47-L75
* Callbacks: https://github.com/TelescopeJS/Telescope/blob/devel/packages/nova-subscribe/lib/callbacks.js#L13-L36
* Permissions: https://github.com/TelescopeJS/Telescope/blob/devel/packages/nova-subscribe/lib/permissions.js

### Reusable component to show a list of subscribed items

There was formerly a component that showed a list of subscribed posts. While reducing the depencies to other packages, it broke. It's on the roadmap to re-enable it. Feel free to discuss about it [on the Slack channel](http://slack.telescopeapp.org/) if you want to build it!

![Subscribe all the things](https://cdn.meme.am/instances/500x/70780773.jpg)

Original PR & discussion can be found here: https://github.com/TelescopeJS/Telescope/pull/1425
