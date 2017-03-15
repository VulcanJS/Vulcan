# ChangeLog

### v1.2.19
16-February-2017

* Fixed an issue with imports when using latest version of react router.

### v1.2.18
6-February-2017

* #94 - Better support for Server-Side Rendering & client-only code in React client-only lifecycle hook

### v1.2.17
7-January-2017

* #55 - Create new form state for Enroll Account

### v1.2.16
7-January-2017

* Added warning on misconfigured LoginForm usage, that could prevent users from
resetting their password.

### v1.2.15
7-January-2017

* #91 - Fixed: localStorage not defined in server side
* Improving experience on successful reset password.
* Reset faulty redirect to reset-password.

### v1.2.14
7-January-2017

* Fixed issue with troublesome redirect in React Router when clicking link to
reset password.

### v1.2.13
6-January-2017

* Fixed issue with faulty duplicate use of componentDidMount in LoginForm.

### v1.2.12
6-January-2017

* #49 - Support for inline field validation message
* Added missing deprecation notices.

### v1.2.11
18-December-2016

* #61 - BUG: Error «Need to set a username or email» when email is set
* Solved #61 by adding functionality to remember entered values in localStorage,
which also makes it possible to remember values between routes (i.e. when
  switching between /login and /register).

### v1.2.10
14-December-2016

* #82 - Fix for empty `input.value` issue and form prefilled issues
* #84 - Quick fix to redirect login/logout
* #75 - Fix issue, when message is object in Accounts.ui.FormMessage
* #58 - call onSubmitHook after all form submissions

### v1.2.9
10-November-2016

* #73 – in constructor, we should use `props` and not `this.props`
* #78 – Move react packages to peerDependencies
* Added support for React Router Link in buttons.

### v1.2.8
26-October-2016

* #70 – Added link to new material UI package.
* #71 – make sure nextProps.formState actually exists before overwriting state

### v1.2.7
19-October-2016

* Make sure `nextProps.formState` actually exists before overwriting
`state.formState`.

### v1.2.6
2-June-2016

* Allow form state to be set from prop formState when logged in #51 @todda00

### v1.2.4-5
28-May-2016

* Adding missing configuration in oauth services.

### v1.2.2-3
24-May-2016

* Solves issue with social redirect flow being redirected to a faulty urls: #36
* Solves issue: Accounts.sendLoginEmail does not work if address is set: #42

### v1.2.1
10-May-2016

* Solves issue with props not being passed down: #39

### v1.2.0
10-May-2016

* Adding the hooks to be passed as props.

### v1.1.19

* Improving hooks for server side rendered pages.
* Improving so that browser pre-filled input values are pushed back to the form
state.

### v1.1.18

* Updated Tracker dependency.

### v1.1.17

* Updated Tracker dependency.

### v1.1.16

* Bumping version on check-npm-versions to solve #29

### v1.1.15

* @SachaG added classes to the social buttons distinguishing which service.

### v1.1.14

* @SachaG added tmeasday:check-npm-versions to check for the correct version of
npm packages.
* @ArthurPai updated T9n, which adds the Chinese language for accounts, so we
can update it to v1.3.3
* @ArthurPai fixed a forgotten update T9n translation in the PasswordOrService
component.
* @PolGuixe fixed the faulty meteor-developer account integration.

### v1.1.13

* Fixed faulty language strings.

### v1.1.12

* Updated to use the latest translations in softwarerero:accounts-t9n

### v1.1.11

* Updated to softwarerero:accounts-t9n@1.3.1
* Don't show change password link if using NO_PASSWORD.

### v1.1.10

* Fixed a bug that caused the form when submitted to reload the page, related:
https://github.com/studiointeract/accounts-ui/issues/18

### v1.1.9

* Fixed a faulty default setting, that got replaced in 1.0.21.

### v1.1.8

* Added notice on missing login services.

### v1.1.7

* Upgraded dependency of softwarerero:accounts-t9n to 1.3.0, related:
https://github.com/studiointeract/accounts-ui/issues/15

### v1.1.6

* Removed server side version of onPostSignUpHook, related issues:
https://github.com/studiointeract/accounts-ui/issues/17
https://github.com/studiointeract/accounts-ui/issues/16

### v1.1.5

* Improving and removing redundant logging.

### v1.1.4

* Bugfixes for Telescope Nova

### v1.1.1-3

* Bugfixes

### v1.1.0

* Renamed package to std:accounts-ui

### v1.0.21

* Buttons for oauth services
* Option for "NO_PASSWORD" changed to "EMAIL_ONLY_NO_PASSWORD"
* Added new options to accounts-password "USERNAME_AND_EMAIL_NO_PASSWORD".

### v1.0.20

* Clear the password when logging in or out.

### v1.0.19

* Added defaultValue to fields, so that when switching formState the form keeps
the value it had from the other form. Which has always been a really great
experience with Meteor accounts-ui.

### v1.0.18

* Bug fixes

### v1.0.17

* Added so that the formState responds to user logout from the terminal.

### v1.0.16

* Bug fix

### v1.0.15

* Added required boolean to Fields
* Added type to message and changed to Object type
* Added ready boolean to form.

### v1.0.12-14

* Bug fixes

### v1.0.11

* Bump version of Tracker.Component

### v1.0.10

* Support for extending with more fields.

### v1.0.1-9

* Bugfixes

### v1.0.0

* Fully featured accounts-password
* Support for "NO_PASSWORD".
