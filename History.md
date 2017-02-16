## v1.1.0 => vNEXT

We now keep track of the version thanks to [`release`](https://github.com/zeit/release).

To see the updates, check the [Nova's repo releases](https://github.com/TelescopeJS/Telescope/releases).

## v1.0.0
- A lot of breaking changes: this is the Apollo/GraphQL version of Telescope Nova. [You can find the documentation here](http://nova-docs.telescopeapp.org/).

## v0.27.5

- Nova is now powered by Meteor 1.4.2.3.
- Newsletter settings + banner behavior fixed ([PR #1513](https://github.com/TelescopeJS/Telescope/pull/1513), thanks [@bengott](https://github.com/bengott)). **⚠️ If you are updating from a previous version of Nova/Legacy, [make sure to run migration script in your app on a server file!](https://github.com/bengott/Telescope/blob/e714aab27b323aee5ddbb97a5ece01a3cdc0e76f/packages/_nova-migrations/lib/server/migrations.js#L746-L782)**
- Fix ESLint issues: revert comment in deep function, support for JSX files, clean up code ([PR #1511](https://github.com/TelescopeJS/Telescope/pull/1511), [PR #1512](https://github.com/TelescopeJS/Telescope/pull/1512), [PR #1515](https://github.com/TelescopeJS/Telescope/pull/1515), thanks [@comus](https://github.com/comus)).
- Remove legacy packages not used anymore `telescope:migrations` & `telescope:invites`.
- Packages with **_** are unmaintained & necessary Meteor packages for Nova to run. We have added small patches to them: `meteorhacks:inject-data` & `react-router:react-router-ssr`.

## v0.27.4

- Nova is now powered by Meteor 1.4.2.1, which provides among other cool features super fast build time! Some NPM dependencies changed: **be sure to run `npm install` again!**
- Fix typo in class name `posts-list-header-categories` ([PR #1487](https://github.com/TelescopeJS/Telescope/pull/1487), thanks [@seanjsong](https://github.com/seanjsong)).
- Make `document` property available to all form components, but don't pass it down to standard input controls to avoid error.
- Do not try to init legacy `Settings` collection client-side: this was an annoying warning that you may have got telling something about a forbidden insert.
- Add reset password components and route ([PR #1491](https://github.com/TelescopeJS/Telescope/pull/1491), thanks [@malively](https://github.com/malively)).
- Add internationalization messages for "no more posts", "no results" and "load more days" ([PR #1499](https://github.com/TelescopeJS/Telescope/pull/1499), thanks [@qge](https://github.com/qge)).
- No more duplicate slugs if a user signs up with an external service (Facebook, Twitter, ..) and another user signs up with a username being the same as the other user (modification on `Telescope.utils.getUnsudedSlug` to handle edge case on `Users` collection).
- Somebody can remove their account themselves again: `users.remove` fixed at the level of the permissions and related callbacks.
- Server-side rendering / data-injection is fixed thanks to a `meteorhacks:inject-data` fork added locally in the packages (`nova-inject-data` folder, [see here for more info](https://github.com/TelescopeJS/Telescope/commit/f988686653b21896c3f5d321f30c34c1b5778628#diff-8f4ee0b18f5c4673b79684ee3c7d2430))
- Add simplified chinese (`zh-CN`) translation package to the README ([PR #1503](https://github.com/TelescopeJS/Telescope/pull/1503), thanks [@qge](https://github.com/qge)).
- Only show comment reply button for logged in users ([PR #1504](https://github.com/TelescopeJS/Telescope/pull/1504), thanks [@qge](https://github.com/qge)).
- Fix React `setState` race condition on `NovaForm` autofilled values ([PR #1507](https://github.com/TelescopeJS/Telescope/pull/1507), thanks [@sherryxiao1988](https://github.com/sherryxiao1988)).
- Fix ESLint config: you can lint your project with `npm run lint`! It is based on `eslint:recommended` + `meteor` extends ([PR #1474](https://github.com/TelescopeJS/Telescope/pull/1474), thanks [@moimikey](https://github.com/moimikey)).

## v0.27.3

- Explain with more details how to deploy with Meteor Up (PR [#1456](https://github.com/TelescopeJS/Telescope/pull/1456), thanks [@asmita005](https://github.com/asmita005)!).
- Add slug to `newPendingPost` notifications, fixes [#1254](https://github.com/TelescopeJS/Telescope/issues/1254).
- Ensure slug unicity on user's slug as done as category's slug (use of `Telescope.utils.getUnusedSlug`), fixes [#1213](https://github.com/TelescopeJS/Telescope/issues/1213).
- Remove some dead code from Telescope Legacy.
- Use of Comment's `getPageUrl` helper in `nova:rss`.
- Prefer `Users` namespace to `Meteor.users` in active packages.
- If you used the property `autoform` on your custom fields, it's now entitled `form`. This was an old reference to [AutoForm](https://github.com/aldeed/meteor-autoform) used by Telescope Legacy. We will give you a console warning if you still use it to advice you to change it.
- Fix errors on `nova:forms`: callbacks from components wrapping a `NovaForm` (ex: `ModalTrigger`) are not fired anymore when it has already been unmounted.
- Fix errors when logging out from the "profile check modal" (`UsersProfileCheck`).
- Prevent errors when creating/editing a category with custom fields (load order of smart methods with extended schema).
- The callback on `nova:subscribe` related to categories has been updated to prevent a user from receiving multiple emails if he/she is subscribed to multiple categories (PR [#1466](https://github.com/TelescopeJS/Telescope/pull/1466), thanks [@chptung](https://github.com/chptung)).
- You can now submit a post/comments (or any `NovaForm` comp) with CMD + Enter / Ctrl + Enter shortcuts (PR [#1472](https://github.com/TelescopeJS/Telescope/pull/1472), thanks [@aszx87410](https://github.com/aszx87410)).
- You can run Telescope Nova inside Docker without deploying (see [this awesome guide](http://spartatek.se/meteor_blog/docker/2016/01/12/running-telescope.html)), fixes [#1477](https://github.com/TelescopeJS/Telescope/issues/1477)
- Add `flex-wrap: wrap;` to posts-categories class for better styling if a user creates a post with too many categories (PR [#1469](https://github.com/TelescopeJS/Telescope/pull/1469), thanks [@chptung](https://github.com/chptung)).

**Changes that may break some parts of your app:**
- Some callbacks have been renamed for consistency purposes: `postsParameters` becomes `posts.parameters`, `profileCompletedAsync` becomes `users.profileCompleted.async`, `profileCompletedChecks` becomes `users.profileCompleted.sync`, `onCreateUserAsync` becomes `users.new.async`, `onCreateUser` becomes `users.new.sync`, `UsersEdit` becomes `users.edit.sync`, `UsersEditAsync` becomes `users.edit.async`.
- The use of `react-bootstrap@0.30.3` is now forced in `package.json`: the latest versions break the dropdown at the moment (see [#1463](https://github.com/TelescopeJS/Telescope/issues/1463)). You should re-run `npm install` if you update from a previous version.
- The `currentUser` props has been removed, the current user is explicitly passed through the context as a matter of consistency across the app. If one of your custom components extending one of `nova:base-components` used `currentUser` as a props, you should update it to use it via the context and add the corresponding contextTypes. See commit [b04cb52](https://github.com/TelescopeJS/Telescope/commit/b04cb5247027fc431f7aa1704ef823ac8ce5fdd1).

## v0.27.2

- Move `updateCurrentValue` function from `propTypes` to `contextTypes` in the datetime picker`DateTime` (`nova:forms`) ([#1449](https://github.com/TelescopeJS/Telescope/issues/1449)).
- Check duplicate links on post's edit [(#247](https://github.com/TelescopeJS/Telescope/issues/247)).
- Cloudinary images from `nova:cloudinary` are now served over HTTPS ([#1224](https://github.com/TelescopeJS/Telescope/issues/1224)).
- Add year and name to licence ([#1117](https://github.com/TelescopeJS/Telescope/issues/1117)).
- Clean Legacy's issues & PRs. Be ready for the [Hacktoberfest](https://hacktoberfest.digitalocean.com/)!! 🍻

## v0.27.1

- Nova uses now React 15.3.x with associated Node modules, besides it prevents unknown prop warnings ([React docs](https://facebook.github.io/react/warnings/unknown-prop.html)). We still depends on `react-meteor-data` and mixins to load data (thanks @MHerszak for careful watch!), we may move soon to Apollo (contributions welcomed on `[apollo](https://github.com/TelescopeJS/Telescope/tree/apollo)` branch).
- README updated. On deployment recommandations: you should go with Mup 1.0.3 ([repo](https://github.com/kadirahq/meteor-up)), MupX is not compatible with Meteor 1.4 ; on 3rd-party packages section, you can now upload images to a CDN ([package](https://github.com/xavcz/nova-forms-upload)).
- The 404 Not Found route has been brought back to `nova:base-routes`, you can customize its shape by editing `Error404.jsx` (`nova:base-components`).
- Added support for a custom CSS class for `SubscribeTo` component.
- No more global variable in `nova:api` (the last one? \o/).
- Fix a version problem with `fourseven:scss`, now running on 3.9.0.
- Remove unnecessary NPM dependency on `load-script` (thanks [@MHerszak](https://github.com/mherszak)!).
- You can now run Nova in Brazilian Portuguese by [adding this package](https://github.com/lukasag/nova-i18n-pt-br) (thanks [@lukasag](https://github.com/lukasag)!).
- Added support for a `defaultValue` property in `nova:forms`. You can define it in your custom fields, it will be added if no value nor prefilled value is defined (thanks [@beeva-franciscocalle](https://github.com/beeva-franciscocalle)!).
- Fixed edge bug when users don't have an `username`, use `displayName` instead (thanks [@jeffreywyman](https://github.com/jeffreywyman)!).

## v0.27.0

- Remove Telescope global variable.
- Update to Meteor 1.4.
- A user can now subscribe to any collection with `nova:subscribe` package ([docs](https://github.com/TelescopeJS/Telescope/tree/master/packages/nova-subscribe)) and a reusable `SubscribeTo` component (thanks [@schabluk](https://github.com/schabluk)!).

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
- Added soft delete for comments (thanks [@justintime4tea](https://github.com/justintime4tea)!).
- Fixed posts notifications bugs. 
- Got rid of a lot of Meteor packages in favor of NPM equivalents.

## v0.25.7

First Nova version. 
