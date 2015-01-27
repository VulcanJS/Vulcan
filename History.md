## v0.14.0 “GridScope”

* Adeed Grid Layout option.
* Cleaned up vote click handling functions and added tests (thanks @anthonymayer!).
* Added `threadModules` zone.
* Added `upvoteCallbacks` and `downvoteCallbacks` callback arrays.
* Fix “post awaiting moderation” message bug.
* You can now subscribe to comment threads (thanks @delgermurun!).
* Added `postApproveCallbacks` callback array.
* Added notifications for pending and approved posts, for admins and end users.
* Renaming "digest" view to "singleday".
* Make sure only valid properties can be added to posts and comments.
* Added newsletter time setting (thanks @anthonymayer!).
* Change "sign up" to "register" (thanks @Kikobeats!).

## v0.13.0 “ComponentScope”

* Tweaked comments layout in Hubbble theme.
* Added Bulgarian translation (thanks @toome123!).
* Cleaned up permission functions (thanks @anthonymayer!).
* Various fixes (thanks @comerc and @Kikobeats!).
* Stopped synced-cron message logging.
* Limit all posts lists to 200 posts.
* Refactored posts lists to use the template-level subscription pattern when appropriate.
* Refactored `single day` and `daily` packages.
* Footer field now accepts Markdown instead of HTML.
* Feeds can now be assigned to a user.
* Various CSS tweaks.
* Fixing newsletter issue.
* Post rank now has its own module.
* Changed how field label i18n works. 

## v0.12.0 “DummyScope”

**Important: existing newsletters and feeds need to be manually enabled in the Settings panel** 

* Added "Enable Newsletter" setting. Note: existing newsletters must be re-enabled. 
* Added "Enable Feeds" settings. Note: existing feeds must be re-enabled.
* Now showing release notes for latest version right inside the app.
* Added dummy posts, users, and comments.
* Added new Events collection for keeping track of important events.
* Log first run event.
* `MAIL_URL` environment variable can now be set from Settings.
* Renamed `viewNav` to `viewsMenu`.
* Renamed `adminNav` to `adminMenu`.
* Improvements to the Post by Feed package.
* Added tests for nav bar (thanks @anthonymayer!).
* **New and improved [documentation](http://telesc.pe/docs).**

## v0.11.1 “FeedScope”

* Post submit and edit forms now submit to their respective methods directly.
* Removed `postSubmitRenderedCallbacks` and `postEditRenderedCallbacks`.
* `telescope-post-by-feed` package now lets you import posts from RSS feeds.
* Adding limit of 200 posts to post list request.
* Refactoring post and comment submit to fix latency compensation issues.
* Tags package now using Autoform. 

## v0.11.0 “AvatarScope”

* Added new `userCreatedCallbacks` callback hook.
* Added new setting to subscribe new user to mailing list automatically.
* Added new `debug` setting. 
* `siteUrl` setting now affects `Meteor.absoluteUrl()`.
* Added new `clog` function that only logs if `debug` setting is true.
* Simplified post module system, modules are not split in three zones anymore.
* Added new `postThumbnail` hook to show Embedly thumbnail. 
* Simplified Hubble theme CSS for both desktop and mobile.
* Many CSS tweaks for Hubble mobile. 
* Show author and commenters avatars on post item.
* Adding description to post list pages and showing them in menus. 
* Improved Russian translation (thanks @Viktorminator!).
* Now using `editorconfig` (thanks @erasaur!).
* Upgraded to `useraccounts:unstyled@1.4.0` (thanks @splendido!).

## v0.10.0 “RefactorScope”

* Renaming Errors to Messages (thanks @yourcelf!).
* Adding `fast-render` (thanks @arunoda!).
* Extracted digest into its own package.
* Adding "scheduled" view that shows upcoming scheduled posts.
* Bringing back "delete post" link that was removed by mistake.
* Made user profile display page modular.
* Made user profile edit page modular.
* Started extracting invites into their own package.

## v0.9.11 “FormScope”

* Now using [Autoform](https://github.com/aldeed/meteor-autoform/)'s **quickform** feature to generate post submit and edit forms. 
* Various fixes by [@anthonymayer](https://github.com/anthonymayer).
* Now using [fourseven:scss](https://github.com/fourseven/meteor-scss) to directly compile SCSS files. 
* Renamed `post` method to `submitPost`. 
* Post editing now happens via a `postEdit` method.
* Categories are now normalized (only the `_id` is stored on the post object, not the whole category object).
* Refactored Embedly package; now fills in description as well (thanks [@kvindasAB](https://github.com/kvindasAB)!).
* Thumbnail height and width are now customizable in settings panel.
* Settings and Post forms now i18n'ized.

## v0.9.10 “i18nScope”

* Now using [tap:i18n](https://github.com/TAPevents/tap-i18n) for internationalization (thanks a ton to @theosp).
* Each package is now i18n'd invididually.
* Chinese i18n code is now `zh-CN`, not `zh`.
* Various fixes (thanks @anthonymayer).
* Upgrade Avatar package (thanks @bengott).

## v0.9.9

* Updating to Meteor 1.0.
* Updating to Iron Router 1.0.
* Adding view counter (thanks @steffenstraetz! See [PR #489](https://github.com/TelescopeJS/Telescope/pull/489))
* Splitting out `router.js` in multiple files.
* URL can now be removed when editing a post (thanks @massimilianomarini! See [PR 484](https://github.com/TelescopeJS/Telescope/pull/484)).
* Now waiting on `allUsersAdmin` subscription for post submit page (thanks @kai101! See [PR 508](https://github.com/TelescopeJS/Telescope/pull/508))
* Putting server-side routes for email template tests in their own respective packages.

## v0.9.8

* Fixing #457 (pending posts view not working).
* Added German translation (thanks @Helmi!).
* Added `?q=` parameter to searches (thanks @yourcelf!).
* Abstracting `isAdmin` (thanks @yourcelsf!).
* Refactoring `getPostsParameters` (thanks @delgermurun!).
* Using `bengott:avatar` package for avatars (thanks @bengott!).
* Upgrading to Meteor 0.9.3.1.

## v0.9.7 “SettingsScope”

* Updating to Meteor 0.9.3.
* Improving RSS feed (thanks @delgermurun!).
* Fixed redirection issues on sign-up (thanks @steffenstraetz!)
* Fixed bug on Twitter sign-in.
* Splitting up the settings form into sub-sections.
* Adding help text to settings form.
* Fixing problem with daily view theming.
* Improving avatar stuff (thanks @shaialon and @bengott!). 

## v0.9.6

* Fixed security hole in user update. 
* Kadira is now included by default. 
* Comments now have their own feed (thanks @delgermurun!).
* Fixed URL collision bug (thanks @GoodEveningMiss!).
* Now using [`account-templates`](https://github.com/splendido/accounts-templates-core) (thanks @splendido!).
* Retinizing avatar sizes (thanks @shaialon!).

## v0.9.5 “FixScope”

* Fixed `/settings` bug (thanks @steffenstraetz!).
* Code cleanup (thanks @wulfmeister!).
* Fixed upvote/downvote concurrency bug (thanks @spifd!).
* Renamed `SubmitServerCallbacks` to `SubmitMethodCallbacks` for posts and comments.
* Added `AfterSubmitMethodCallbacks` for posts and comments.
* Made notifications into their own `telescope-notifications` package.
* `telescope-update-prompt` package now sends user, post, and comment count when phoning home.

## v0.9.4 “UpdateScope”

* Removed unneeded allow insert on Posts and Comments. 
* Renaming `postMeta` template to `postInfo` to avoid ambiguity.
* Fixing avatar code.
* Adding update prompt package.
* Upgrading to Meteor 0.9.2.
* Do not remove deleted comments from database, use `isDeleted` flag instead.
* Now showing "X new posts" instead of just displaying them. Thanks @dburles!

## v0.9.3 “DailyScope”

* Show user comments on user profile page. 
* Move votes to their own `user.votes` object.
* Add daily view.
* Default root view is now customizable. 
* Updated app to 0.9.0.
* Updated all packages to be 0.9.0-compatible.
* Fixed XSS bug (CVE ID: CVE-2014-5144) by sanitizing user input server-side.
* Now storing both markdown and HTML versions of content. 

## v0.9.2.6 “InviteScope”

* Added new invite features (thanks [@callmephilip](https://github.com/callmephilip)!)
* Changed `navItems` to `primaryNav` and added `secondaryNav`. 
* Added new `themeSettings` object for storing theme-level settings.
* Notifications is now a nav menu item. 
* Renamed `comments` to `commentsCount` on `Post` model.
* Now tracking list of commenters `_id`s on `Post` model.
* Rerun interrupted migrations. 

## v0.9.2.5 “AccountScope”

* Now keeping track of upvoted/downvoted posts & comments.
* Using [accounts-entry](https://github.com/Differential/accounts-entry/) for accounts stuff.
* Split out part of the Hubble theme into a new “base” theme.

## v0.9.2 “MailScope”

* Use [handlebars-server](https://github.com/EventedMind/meteor-handlebars-server) for all email templates. 
* Refactored email system to use global HTML email wrapper.
* Added routes to preview email templates. 
* Changed how notifications are stored in db.
* Added `deleteNotifications` migration to delete all existing notifications.
* Now using templates for on-site notifications too.
* Added `heroModules` and `footerModules` hooks.
* Added [telescope-newsletter](https://github.com/TelescopeJS/Telescope-Newsletter) package. 
* Sending emails from within `setTimeout`s to fix latency compensation issue. 

## v0.9.1.2

* Added `lastCommentedAt` property to posts. 
* Added hooks to `post_edit` and `post_submit`'s `rendered` callback.
* Embedly module now supports video embedding in a lightbox.
* Updated to Meteor 0.8.3.
* Updated packages.

## v0.9.1

* Using Arunoda's [Subscription Manager](https://github.com/meteorhacks/subs-manager).
* Updating mobile version.
* Made the background color setting into a more general background CSS setting. 
* Added `postHeading` and `postMeta` hooks. 

## v0.9

* See [blog post](http://telesc.pe/blog/telescope-v09-modulescope) for changelog. 

## v0.8.3 “CleanScope”

* Refactored the way dating and timestamping works with pending/approved posts. 
* Cleaned up unused/old third-party code.
* Migrated "submitted" property to "postedAt".
* Added a "postedAt" property to comments.

## v0.8.2 “SchemaScope”

* Improved migrations with timestamps and number of rows affected.
* Created `telescope-lib` and `telescope-base` pacakge.
* Pulled out search into its own `telescope-search` package.
* Made menu and views modular. 
* Using SimpleSchema and Collection2 for models.

## v0.8.1 “FlexScope”

* Extracted part of the tags feature into its own package. 
* Made subscription preloader more flexible.
* Made navigation menu dynamic. 

## v0.8 “BlazeScope”

* Updated for Meteor 0.8.1.1/Blaze compatibility.
* Using Collection2/SimpleSchema/Autoforms for Settings form. 

## v0.7.4 “InterScope”

* Added basic internationalization (thanks Toam!).
* Added search logging. 

## v0.7.3

* Refactored notifications.
* Added notifications for new users creation.

## v0.7.2

* Added basic search (thanks Ry!).

## v0.7.1

* Added karma redistribution.
* Improved user dashboard.
* Improved user profiles. 

Note: run the "update user profile" script from the toolbox after updating. 

## v0.7 “IronScope”

#### Huge update!

* Switched to IronRouter.
* Added new invite system.
* Made nested comments optional.
* Reworked notifications settings.
* Stopped publishing all users.
* Added URL slugs for user profiles.
* Using nProgress to show loading.
* Paginating users dashboard.
* Filtering users dashboard.

Note: If you're upgrading from a previous version of Telescope, you'll need to run the "update user slugs" method from within the Admin Toolbox panel inside the web app to get user profiles to work. 

## v0.6.2

* Fixed bug where anybody could delete any comment.
* Added option to add new users to a MailChimp list.

## v0.6.1

* Added Bitly integration.
* Fixed Twitter avatars.
* Refactoring allow/deny code.
* Added click tracking on links.
* Refactoring RSS and API code to use server-side routing.

## v0.6

* Added categories
* Cleaned up file structure.

## v0.5.6

* Added simple JSON API showing the 100 last posts.

## v0.5.5

* Added Google Analytics pageview tracking.
* Added RSS feed for /new

## v0.5.4

* Added email notifications for approved users.
* Added delete users link.

## v0.5.3

* Added basic color customization.
* Fixed Flush bug.

## v0.5.2

* Added email notifications of new comments and new replies for all users (along with unsubcribe link) and notifications of new posts for admin users.

## v0.5.1

* Added a second `createdAt` timestamp. Score calculations still use the `submitted` timestamp, but it only gets set when (if) a post gets approved.

* Started keeping track of versions and changes.