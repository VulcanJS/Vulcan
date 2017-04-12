# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## To Be Released

### Added

- Added support popoverComponent on the `MentionSuggestions` component. Thanks to @samdroid-apps
- Introduced a new configuration option `mentionTrigger`. By default it is set to `@`. As before by default typing `@` will trigger the search for mentions. You can provide a custom character or string to change when the search is triggered. [#320](https://github.com/draft-js-plugins/draft-js-plugins/pull/320) Thanks to @yjang1031
- MentionSuggestions accepts a new prop `entryComponent`. The passed component is used as the template for each of the suggestions' entry. [#317](https://github.com/draft-js-plugins/draft-js-plugins/pull/327). Thanks to @Zhouzi
- `defaultEntryComponent` component is passed `searchValue` prop to enable more customizations when displaying the the MentionSuggestions. Thanks to @nishp1
- The config now accepts a new prop `mentionComponent`. If provided the passed component is used to render a Mention. [#271](https://github.com/draft-js-plugins/draft-js-plugins/pull/271). Thanks to @alexkuz
- Introduced the `mentionRegExp` configuration to overwrite the regular expression for initiating the dropdown. By default this supports any alphanumeric character as well as Chinese, Japanese & Korean characters.
- Added support for Chinese words. Thanks to @mzbac
- Added support for Japanese characters (hiragana & katakana).
- Added support for Korean characters (Hangul Syllables & Hangul Compatibility Jamo). Thanks to @FourwingsY
- Added `onAddMention` prop to MentionSuggestions. The first argument of this callback will contain the mention entry.

### Fixed

- Reopens mentions dropdown if new suggestions are available. Thanks to @jameskraus [#659](https://github.com/draft-js-plugins/draft-js-plugins/pull/659)
- Solved a bug with @ being placed in the beginning. Thanks to @hjyue1 [#621](https://github.com/draft-js-plugins/draft-js-plugins/pull/621)
- Fixed "Cannot read property 'getBoundingClientRect' of null" issue. Thanks to @ismyrnow [#666](https://github.com/draft-js-plugins/draft-js-plugins/pull/667)
- Mentions popover showed up when typing before a @ [#323](https://github.com/draft-js-plugins/draft-js-plugins/issues/323) Thanks to @nishp1
- Only pass element properties to the root Div of MentionSuggestions to remove the "Unknown prop warning" in React 15.2.0
- Fixed bug where a user typed @xxx (invalid mention) and hit Enter. [#416](https://github.com/draft-js-plugins/draft-js-plugins/pull/416)
- Fixed bug where press up arrow would not cycle back to the bottom of suggestions
- Fixed race condition where the SuggestionPortal would unregister and not register again when inputting Japanese, etc.
- Fixed bug where `mentionPrefix` does not appear in `editorState`. `mentionPrefix` is no longer passed to `mentionComponent`.
- Fixed bug where `onSearchChange` didn't fire when a user switched between two different mention autocompletions with the same search value. Now it will trigger `onSearchChange` in such a case.

## 1.1.2 - 2016-06-26

### Fixed

- Accepts plain JavaScript Objects for mentions from now on. Until now it only accepted an `Immutable.Map`. This change would make it play nicer together with `convertFromRaw` by default. Thanks to @anderslemke [#326](https://github.com/draft-js-plugins/draft-js-plugins/pull/326)
- `positionSuggestions` now works by default with non-static parents. Thanks to @Zhouzi
[#309](https://github.com/draft-js-plugins/draft-js-plugins/pull/309)
[#206](https://github.com/draft-js-plugins/draft-js-plugins/issues/206)
[#283](https://github.com/draft-js-plugins/draft-js-plugins/issues/283)
[#289](https://github.com/draft-js-plugins/draft-js-plugins/issues/289)

## 1.1.1 - 2016-06-05

### Fixed

- Close mention suggestions when suggestions filtered results are empty [#291](https://github.com/draft-js-plugins/draft-js-plugins/pull/291) [#265](https://github.com/draft-js-plugins/draft-js-plugins/issues/265)

## 1.1.0 - 2016-05-27

### Added

- `MentionSuggestions` now accepts `onOpen`and `onClose` props. These callbacks are triggered when the popover has opened or closed.

## 1.0.2 - 2016-05-24

### Fixed

- Fix rendering the MentionSuggestions in IE11 by avoiding to render an Immutable List [#266](https://github.com/draft-js-plugins/draft-js-plugins/issues/266) [#270](https://github.com/draft-js-plugins/draft-js-plugins/pull/270)
- Fix React 0.14.x support by returning `<noscript />` instead of `null` [#267](https://github.com/draft-js-plugins/draft-js-plugins/pull/267)

## 1.0.1 - 2016-04-29

### Fixed

- Make sure there is no autocomplete on tab after deleting a mention [#234](https://github.com/draft-js-plugins/draft-js-plugins/issues/234)

## 1.0.0 - 2016-04-20

### Changed

- Instead of the popover inline it is now exported as `MentionSuggestions` and can be placed anywhere in the DOM. It's recommended to place it right after the Editor. This change was important to avoid selection issues trigged by `contentEditable={false}`.
- `mentions` has been renamed to `suggestions` and now has to be directly provided to the `MentionSuggestions` component as property.
- Moved to a flat configuration. Instead of plugin properties (decorators & hooks) being stored within pluginProps they now moved to the root object. See the changes here [#150](https://github.com/draft-js-plugins/draft-js-plugins/pull/150/files) as well as the initial discussion here [#143](https://github.com/draft-js-plugins/draft-js-plugins/issues/143)
- Improved the regex and now test for a whitespace in front of the `@` to make sure it doesn't match on normal text like an email [#104](https://github.com/draft-js-plugins/draft-js-plugins/issues/104)
- Moved the option `theme` from an Immutable Map to a JavaScript object. This is more likely to become a standard.
- Improved styling and added animations for the Suggestions overlay as well as the hover on a single suggestion.
- Updated the theme properties.

### Fixed

- Fix using backspace to close the autocomplete suggestions after typing an `@` [#110](https://github.com/draft-js-plugins/draft-js-plugins/issues/110)

### Added

- The config now takes a property `entityMutability`. A developer can choose between 'IMMUTABLE', 'SEGMENTED' & 'MUTABLE'. Read in detail about it [here](https://facebook.github.io/draft-js/docs/advanced-topics-entities.html#mutability).
- The config now takes a property `positionSuggestions`. The function can be used to manipulate the position of the popover containing the suggestions. It receives one object as arguments containing the visible rectangle surrounding the decorated search string including the @. In addition the object contains prevProps, prevState, state & props. An object should be returned which can contain all sorts of styles. The defined properties will be applied as inline-styles.
- Introduce a new config property: `mentionPrefix`. By default it is an empty String. For Twitter or Slack like mention behaviour you can provide an `@`.

```
const mentionPlugin = createMentionPlugin({ entityMutability: 'IMMUTABLE' });
```

- The `MentionSuggestions` component now takes a property `onSearchChange` which will trigger whenever the search value of changes.
- The module now exports `defaultSuggestionsFilter` for convenience. As first argument it takes the search term as a String. The second argument is the Immutable list of mentions. The function returns the filter list based on substring matches.

## 0.0.4 - 2016-03-29

### Fixed
- Fix issue with showing two menus at the same time [#132](https://github.com/draft-js-plugins/draft-js-plugins/issues/132)
- When typing ahead to 0 results and then back the first item must be still selected. [#149](https://github.com/draft-js-plugins/draft-js-plugins/pull/149)

## 0.0.3 - 2016-03-25
### Released the first working version of DraftJS Mention Plugin

It's not recommended to use the version 0.0.0 - 0.0.2
