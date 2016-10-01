## v0.27.2
- Move `updateCurrentValue` function from `propTypes` to `contextTypes` in the datetime picker`DateTime` (`nova:forms`) (#1449).
- Check duplicate links on post's edit (#247).
- Cloudinary images from `nova:cloudinary` are now served over HTTPS (#1224).
- Add year and name to licence (#1117).
- Clean Legacy's issues & PRs. Be ready for the [Hacktoberfest](https://hacktoberfest.digitalocean.com/)!! 🍻

## v0.27.1

- Nova uses now React 15.3.x with associated Node modules, besides it prevents unknown prop warnings ([React docs](https://facebook.github.io/react/warnings/unknown-prop.html)). We still depends on `react-meteor-data` and mixins to load data (thanks @MHerszak for careful watch!), we may move soon to Apollo (contributions welcomed on `[apollo](https://github.com/TelescopeJS/Telescope/tree/apollo)` branch).
- README updated. On deployment recommandations: you should go with Mup 1.0.3 ([repo](https://github.com/kadirahq/meteor-up)), MupX is not compatible with Meteor 1.4 ; on 3rd-party packages section, you can now upload images to a CDN ([package](https://github.com/xavcz/nova-forms-upload)).
- The 404 Not Found route has been brought back to `nova:base-routes`, you can customize its shape by editing `Error404.jsx` (`nova:base-components`).
- Added support for a custom CSS class for `SubscribeTo` component.
- No more global variable in `nova:api` (the last one? \o/).
- Fix a version problem with `fourseven:scss`, now running on 3.9.0.
- Remove unnecessary NPM dependency on `load-script` (thanks @MHerszak!).
- You can now run Nova in Brazilian Portuguese by [adding this package](https://github.com/lukasag/nova-i18n-pt-br) (thanks @lukasag!).
- Added support for a `defaultValue` property in `nova:forms`. You can define it in your custom fields, it will be added if no value nor prefilled value is defined (thanks @beeva-franciscocalle!).
- Fixed edge bug when users don't have an `username`, use `displayName` instead (thanks @jeffreywyman!).

## v0.27.0

- Remove Telescope global variable.
- Update to Meteor 1.4.
- A user can now subscribe to any collection with `nova:subscribe` package ([docs](https://github.com/TelescopeJS/Telescope/tree/master/packages/nova-subscribe)) and a reusable `SubscribeTo` component (thanks @schabluk!).

*The rest of the modifications are not yet documented, you can [browse the commits history from there](https://github.com/TelescopeJS/Telescope/commits/2b34713c0b6dbf094668f8a87d007443a1e2c580).*

## v0.26.5

- Creation of a permissions (groups) API for the users.
- The routes are now more easy to customize, [see docs](https://github.com/TelescopeJS/Telescope/tree/master#routes).

*The rest of the modifications are not yet documented, you can [browse the commits history from there](https://github.com/TelescopeJS/Telescope/commits/cfc52b1158f3dd9cfc98ef5081f558112dc3c3cc).*

## v0.26.4

- Collections are not globals anymore, you need to import them in order to use them.
- NovaForm has been improved with a placeholder options for text fields and you can enhance any field with components placed before and after it.

*The rest of the modifications are not yet documented, you can [browse the commits history from there](https://github.com/TelescopeJS/Telescope/commits/4f61940b07c48c6b3c7f13a47002c0199652a346).*

## v0.26.3

- Switch from FlowRouter to React-Router v3.

*The rest of the modifications are not yet documented, you can [browse the commits history from there](https://github.com/TelescopeJS/Telescope/commits/7b8624f709b6130fa8f93a141775491dc2455bbf).*

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