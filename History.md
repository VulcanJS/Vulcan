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