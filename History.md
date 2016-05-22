## v0.26.2

- Made component names more consistent; Collection names (“Posts”, “Comments”, etc.) are **always plural** in component names.
- Routes now live in their own package (`nova:base-routes`).
- The search now searches in the `excerpt` field, not `body`, because `body` is not published to the client (and searches would give different results on client and server). 
- Removed option to manually set a post's author. 
- The Embedly thumbnail feature now includes a "clear thumbnail" link to remove it and an option to enter a URL manually. 
- There is now an autofill tags component you can optionally include and use with `meteor add nova:forms-tags` (see Embedly package custom fields for how to use custom components in forms).
- You can now see a post's ID and stats in the post edit form if you're an admin.
- Fixed bug (I hope?) where daily view would become messed up when client and server were on different timezones.
- Now showing a user's posts on their profile page. 
- Added soft delete for comments (thanks @justintime4tea!).
- Fixed posts notifications bugs. 
- Got rid of a lot of Meteor packages in favor of NPM equivalents.

## v0.25.7

First Nova version. 