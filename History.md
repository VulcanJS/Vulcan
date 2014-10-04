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