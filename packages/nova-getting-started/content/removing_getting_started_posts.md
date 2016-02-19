### Removing Getting Started Posts

If you're ready to insert your own content and want to delete these getting started posts, comments, and users, you can do so with a single command.

Just make sure you're logged in, then open your [browser console](http://webmasters.stackexchange.com/questions/8525/how-to-open-the-javascript-console-in-different-browsers) and type:

```js
Meteor.call('removeGettingStartedContent');
```

See you on the other side!