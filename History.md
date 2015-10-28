## v0.25.5 “PrefixerScope”

* Various small bug fixes.
* Added `seba:minifiers-autoprefixer` to re-enable CSS prefixing. 

## v0.25.4 “PrerenderScope”

* Added `telescope:prerender` package.
* Fixed bad analytics logging.
* Modules' `only` and `except` options can now accept functions.
* `prefilledCategories` Session variable can now be used to prefill the categories selection checkboxes.
* Default post fields now have an `order` (10, 20, 30, etc.).
* i18n: Kasakh, Indonesian

## v0.25.2 “MenuScope”

* Added `regenerateAllThumbnails` method.
* Fixed `postedAt` issue with pending posts. 
* Created `postsListTop` zone and moved `messages`, `category_title`, and `views_menu` modules to it.
* Renamed `category_menu_item` template to `categories_menu_item`.
* Added `itemTemplate` option to menu to enable setting a custom template for all elements.
* Created new `defaultMenuItem` template.
* Now passing reference to whole `menu` object to each node instead of just `menuItems`.
* Renamed `top` zone to `contentTop`.
* Created new `contentBottom`, `postsListTop`, `postsListBottom` zones.
* Extracted menu component into its own `utilities:menu` package.
* Newsletter banner is now included in `contentTop` zone, not `hero`. 
* Renamed "Outside Links Point To" setting to "RSS Links Point To".
* Added infinite scrolling option.
* Added one hour offset to show future posts to fix real-time bug. 

## v0.25 “FlowScope”

### Meteor 1.2

* Updated for Meteor 1.2

### Flow Router

* Switched from Iron Router to Flow Router.
* Moved auth/permission logic from router to templates.
* Removed `/top`, `/new`, `/best`, etc. routes.

### Categories

* New category filter mode.
* New settings option to switch between regular categories and filter categories. 
* On post edit page, auto-expand selected categories. 
* On post submission, auto-add all parents of all selected categories. 
* Now including posts from children categories in posts category count.
* Added option for auto-hiding empty categories. 
* In category menu, expand category tree to show active categories. 

### Other New Features

* New post approval/rejection workflow: pending posts can be approved or rejected; approved posts can only be rejected; rejected posts can only be approved. 
* Added approved/reject/delete buttons to post item actions. 
* Added `rejected` view to show all rejected posts. 
* `Posts.parameters.get` now iterates over the `postsParameters` callback hook to build parameters object. 
* `Comments.parameters.get` now iterates over the `commentsParameters` callback hook to build parameters object. 
* RSS feed and API can now both accept any post query parameter (`limit`, `view`, `cat`, `before`, `after`, etc.)
* Now passing current user ID to `Posts.parameters.get` query constructor.
* Added `afterEmbedlyPrefill` callback hook on client. 
* Removing a user now gives the option to remove their posts and comments, too. 

### Renamings

* `postApprovedAsync` hook renamed to `postApproveAsync`, added `postRejectAsync`.
* Changed `Posts.getSubParams` to `Posts.parameters.get`.
* Changed `Comments.getSubParams` to `Comments.parameters.get`.

### Removals

* Removed `Telescope.utils.getCurrentTemplate()`;
* Removed search logging.
* Disabled single day view. 
* `Posts.checkForSameUrl` doesn't auto-upvote the existing post anymore. 
* Removed delete link from post edit page. 

### Menu Component

* Menu item custom data context is now passed as item.data.
* Add nesting level CSS class to menu items. 

### Other Changes

* Moved schema i18n to collection level.
* Use `Users.adminUsers` more consistently.
* Upvote/downvote functions now take document `_id` as argument, not document object itself.
* Using `tmeasday:publish-counts` to publish posts category counts (instead of denormalizing). 
* Fixed delay on post submission.
* Updated `category_title` template to handle multiple categories.
* Fixed Subscribe to Comments feature. 
* Fixed Safari CSS issues by enabling autoprefixer.
* Extracted Spiderable into its own `telescope:spiderable` package. 

### i18n

* Korean translation.
* Slovenian translation.
* Italian translation.

## v0.24 “SubScope2”

* [BREAKING] Modules data context must now be passed on explicitely using the `moduleData` attribute. 
* [BREAKING] Updated `category_title` template.
* [BREAKING] Refactored `post_admin` template. Added delete link, now using icons, and moved post edit link from `post_info` to `post_admin`. 
* When in debug mode, you can now log out information about a template to the console by clicking on it. 
* Improved category slug generation logic to avoid duplicate slugs.
* [BREAKING] `custom_` prefix is now always loaded last, and takes priority over every other prefix. 
* Added Quickfit script to auto-fit site title to sidebar width in side nav layout.
* [BREAKING] Removed menu component's `menuMode` argument, now doing menu variants via CSS and `menuClass`.
* [BREAKING] Got rid of accordion menu variant.
* [BREAKING] Tweaked markup of menu component.
* Now showing "Post" button to logged out users, too. 
* Icons are now always displayed square with fixed width.
* [BREAKING] Added wrapper `div` to notification, user, and categories menus
* Improved debug mode: you can now click any template to log out its information to the console. 
* Custom menu item templates now inherit helpers from `menuItem` template. 
* Added category hierarchy breadcrumbs to `category_title` template.
* Post submit form now uses collapsible categories menu.
* When adding a category to a post, all parents are now automatically added by default. 
* Added `Category.postsCount` to keep track of how many posts are in a category. 
* Now filtering out categories with no posts from the categories menu. 
* Added `postDeleteAsync` callback hook. 
* Now publishing all public user data all the time to work around nested fields subscriptions bug. 
* Categories with same name now get different, unique slugs. 
* Now getting link source name and URL from Embedly if available.
* [BREAKING] Renamed `posts_views_nav` to `views_menu`. 
* Added `Telescope.modules.addRoute` to add new routes to existing modules.

## v0.23 “SubScope”

* Template modules now take `only` and `except` options to only display on specific routes.
* Now only caching first 15 days of `posts_daily` view.
* Added `okgrow:iron-router-autoscroll` package.
* Small tweaks to search UX.
* [BREAKING] Use collection helpers instead of `postLink` and `target` in `post_title` and `post_thumbnail`.
* [BREAKING] Use collection helpers instead of `pathFor` in `post_comments_link` and `post_discuss`.
* Added new i18n strings.
* Modified custom template prefix system to accept multiple prefixes.
* [BREAKING] Changed `Telescope.config.customPrefix = "foo"` to `Telescope.config.addCustomPrefix("foo")`.
* Added new `facebookPage` setting.
* Added category description to category menu, when it exists.
* Fixed post category and post thumbnail CSS classes. 
* Switched back to `aldeed:autoform` instead of `sacha:autoform`.
* Updated to Meteor 1.1.0.3.
* Added support for menu hierarchies.
* Added hierarchical categories. 
* Now only showing "play" button for actual videos.
* Not subscribing to `postsListUsers` on user profile page anymore.
* Added per-category RSS routes (thanks @lewisnyman!)
* Now showing top comments in email newsletter (thanks @sungwoncho!)
* Fixed blank URL edit bug (thanks @johnthepink!)
* Added `.posts-day` wrapper in `posts-daily` template.
* [BREAKING] menu label template must now be specified using `menuLabelTemplate` option in menu component.
* Menu label template data context can now be specified using `menuLabelData` option. 
* `user_menu` template and its helpers moved from `telescope:core` to `telescope:users`.
* Now recalculating email hash whenever email changes.
* Added user avatar to user menu in nav. 

## v0.22.2

* Made `approvePost` and `unapprovePost` methods take `postId` instead of `post` as argument and fixed approve/unapprove bug. 
* Now sorting email newsletter posts by `baseScore` (time-independent), not `score`.

## v0.22.1 “DebugScope”

* Introduced new [template debug mode](http://docs.telescopeapp.org/docs/debug-mode).
* Fixed invites bugs (thanks @badibouteraa!).
* Made hero modules full width (thanks @jshimko!).
* Renamed `nav` template to `header`.
* Renamed `postsListTop` zone to `top`.
* Renamed `footer` template to `footer_code`, which is part of the `footer` module zone. 
* Any template can now be used as menu label in menu component.
* Added `Telescope.menuItems.removeAll()`
* Number of columns in Hubble grid layout now adapts to viewport width.
* Added image support to RSS feed and API.
* Added setting for pointing RSS feed to discussion pages.
* Made video lightbox responsive and made video stop on lightbox close.
* Simplified template modules markup structure.
* Fixed bug preventing non-logged-in users from signing up to newsletter (thanks @frabrunelle!).
* Moved errors and banners styles to base theme.
* Updated Kadira package.
* Implemented post-specific SEO logic for generating Open Graph and Twitter meta tags.

## v0.21.2 “FastScope”

* Added day by day settings for newsletter frequency (thanks @johnthepink!).
* Implemented Subs Manager.
* Implemented FastRender.
* Now using `check` for methods. 

## v0.21.1 “SlugScope”

* Added URL slugs for posts (i.e. `/posts/xyz/my-post-slug`).
* i18n files clean-up.
* Added post downvote setting.
* Renamed `post_upvote` template to `post_vote`.
* Refactored notifications code.
* Added `kadira-debug` package.
* Fixed avatar bug.
* Fixed screen refresh bug on post page.
* Fixed security issue (thanks @delgermurun).
* Fixed security issue (thanks @pcorey).
* Added Swedish translation (thanks @Alekzanther).
* Improved French translation (thanks @camilleroux).

## v0.20.6 “AutoScope”

* Added Extra CSS field (thanks @johnthepink!).
* Fixed security issue with Settings (thanks @jshimko!).
* Added automatic template replacement.

## v0.20.5 “MinorScope”

Just a couple minor bug fixes.

* Changed how email template customization works (see [documentation](http://docs.telescopeapp.org/v0.20/docs/custom-templates#email-templates)).
* Ensure email uniqueness and keep it in sync.
* Improve profile completion screen validation & errors.
* Generate public user properties list from schema.
* Fixed video lightbox issue.
* Updated Getting Started content.
* Enforcing better URL formatting for Site URL setting.
* Fixed notification settings.
* Reworked user settings.

## v0.20.4 “RefactorScope”

See [blog](http://telescopeapp.org/blog/telescope-v020-refactorscope/) for more details. 

## v0.15.1 “PageScope”

* Settings now have their own `telescope-settings` package (thanks @delgermurun!).
* Swedish translation (thanks @Alekzanther!)
* Various fixes (thanks @azizur, @ndarilek, @kai101, @saimeunt, @Kikobeats!).
* Added `telescope-pages` module for managing static pages. 

## v0.15 “SideScope”

#### Layout

* Added new `postListTop` zone that only appears on post lists. 
* Now showing tagline on every post list. 
* Added the Side Nav layout.
* New Admin menu layout.

#### Settings

* Added the Post Views setting.
* Changed color settings names.
* Added field for optional category image (thanks @dtsepelev!).

#### SEO

* Added `telescope-sitemap` package (thanks @yourcelf!).
* Added improved SEO support (thanks @yourcelf!).
* Added field for SEO site image.

#### Other

* Improved performance when loading comments for long threads (thanks @dandv!).
* Usernames are now case and space insensitive. `John Smith`, `JohnSmith`, and `johnsmith` are now all considered to be the same username (thanks @splendido!). 
* Now using `feedparser` instead of `htmlparser2` to parse RSS feeds (thanks @delgermurun!).
* Now supporting RSS categories (thanks @delgermurun).
* Refactored dropdowns into menu components.
* New `{{{icon}}}` helper for icons, using FontAwesome.
* New accent color customization API. 
* Fixed various bugs (thanks @webyak, @yourcelf, @ywang28, @delgermurun!).
* Now publishing upvoters and downvoters on single post page. 

#### Internationalization

* Added Arabic translation (thanks @nwabdou85!).
* Added missing translations in Brazilian Portuguese (thanks @alanmeira!).
* Improved French translation (thanks @klamzo!).
* Romanian translation (thanks @razvansky!).
* Added Dutch translation (thanks @reneras!).

## v0.14.3 “TableScope”

* Implemented Reactive Table for the Users dashboard (thanks @jshimko!).
* Upgraded Herald package (thanks @kestanous!).
* Upgraded Avatar package (thanks @bengott!).
* Upgraded Autoform package.
* Added Greek translation (thanks @portokallidis!).
* Improved Spanish translation (thanks @brayancruces!).
* Added new callbacks for upvoting and downvoting (thanks @Baxter900 !).
* OP comments now get the `author-comment` CSS class.

## v0.14.2 “FaviconScope”

* Added settings for auth methods.
* Added setting for external fonts.
* Use site tagline as homepage title.
* Make favicon customizable.
* Making webfont customizable. To get previous font back, use: `https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700,400italic,700italic`.
* Fix juice issue.
* Non-admins should not be able to access rejected posts.
* Bulgarian translation (thanks @durrrr91!)

## v0.14.1 “TaglineScope”

* Fix double notification bug. 
* Fix singleday view bug.
* Fix post approval date bug.
* Don't let non-admins access pending posts.
* Give search field a border on white backgrounds.
* Spanish, Brazilian, Turkish, Vietnamese, Polish translations (thanks everybody!).
* Do not put comment reply page behind log-in wall.
* Various CSS tweaks.
* Added tagline banner package.
* You can now assign a category to posts generated from feeds (thanks @Accentax!).
* Use tagline as title on homepage.
* Refactor default view route controller code. 
* Fixed security issue with post editing.

## v0.14.0 “GridScope”

* Added Grid Layout option.
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
* Added new `Telescope.log` function that only logs if `debug` setting is true.
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
