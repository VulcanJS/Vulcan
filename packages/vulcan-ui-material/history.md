1.16.0_3 / 2021-02-16
=====================

 * Theme provider now uses Components.ThemeProvider on the server side, similar to client side, in order to enable theming overrides in SSR.

1.16.0_2 / 2020-11-16
=====================

 * Base controls
   * I have renamed components in `vulcan-ui-material/lib/components/forms/base-controls/` because their names conflict with the style sheet names (used for [Global theme overrides](https://material-ui.com/customization/components/#global-theme-override)) of some core MUI components - for example `MuiInput`.
   * These components are not registered with `registerComponent`, only exported.
   * This will be a breaking change for anyone who has built custom components based on these base controls using import - the file and component names have to be updated.
   * The new names are:
     * **/forms/helpers/**
       * MuiFormControl => FormControlLayout
       * MuiFormHelper => FormHelper
       * MuiRequiredIndicator => RequiredIndicator
     * **/forms/base-controls/**
       * MuiCheckbox => FormCheckbox
       * MuiCheckboxGroup => FormCheckboxGroup
       * MuiInput => FormInput
       * MuiPicker => FormPicker
       * MuiRadioGroup => FormRadioGroup
       * MuiSelect => FormSelect
       * MuiSuggest => FormSuggest
       * MuiSwitch => FormSwitch
       * MuiText => FormText
 * The sample **Theme styles** page now displays sample buttons in addition to typography and color palettes
 
1.16.0_1 / 2020-10-24
=====================

 * MuiSuggest
   * Fixed how styles are applied for focused, disabled, and error states
   * Enabled the styling of `menuItem`, `menuItemHighlight`, and `menuItemIcon` classes
   * Renamed `muiIcon` class to `selectIcon`
   * Fixed a bug when `disableSelectOnBlur` prop was passed
   * Tweaked the behavior of `highlightFirstSuggestion()`
   * Added support for `inputRef` prop
 * MuiInput: Previously the field value was not updated until the user exited the input (`blur` event); now the value is updated as you type, enabling the form submit button sooner
 * Various components: Changed the type of component props to `PropTypes.oneOfType([PropTypes.node, PropTypes.elementType])`
 * Various components: Updated spacing to comply with linting rules
 * ScrollTrigger: Refined functionality
 * TooltipButton: Changed `buttonWrap` display to `inline-flex`
 * Datatable: Added support for the `label` column prop where you can pass text, or a React element
 * Component mixin: Updated list of fields in `cleanProps()`
 * EndAdornment: Tweaked button spacing
 * StartAdornment: Changed icon button to a `TooltipButton`
 * Countries: Added `getRegionCode()` function
 * FormSubmit: Tweaked button spacing
 * ThemeStyles: Fixed minor bugs
 * ModalTrigger: Now the trigger component is rendered using `instantiateComponent()`, the same as component props are rendered elsewhere
 
1.16.1 / 2020-08-17
===================

 * Updated Material UI to version 4.11.0 and updated related packages to the latest version
 * Fixed minor bugs related to the MUI update
 * MuiInput, Email, Url
   * The value of `url` and `email` type inputs are scrubbed to make sure they output a valid url; `url`, `email`, and `social` type inputs display an active link
   * MuiInput: The input now supports an empty label and adjusts the spacing accordingly
 * EndAdornment: refactored the menu indicator  
 * MuiFormControl: new `layout` prop value of 'shrink' turns off the `fullWidth` option for the control  
 * MuiSelect: added clear button to select controls the same as input and suggest controls  
 * MuiSwitch: added support for `addonBefore` and `addonAfter` the same as input and suggest controls
 * Modal
   * Removed bottom border when `Modal` dialog title is empty
   * Moved `closeButton` style to `theme.utils`
   * New `dontWrapDialogContent` prop prevents wrapping the children in a `DialogContent` component
   * `DialogTrigger`'s content is now lazy rendered
   * Added deprecation warning: _ModalTrigger’s "dialogProperties" prop has been renamed "dialogProps"_
 * LoadMore, ScrollTrigger
   * Added `scroller` prop which defaults to `window`, but can be set to the ref of another element
   * Refactored for more reliable performance
 * MuiSuggest
   * Wrapped option icon in ListItemIcon component
   * Fixed bug: `MuiSuggest` would not accept or display values that don't match an option value, even when `limitToList` was false
   * Numerous other bug fixes and refactoring 
 * TooltipButtonUpgrades
   * Added new props: `danger` and `cursor`
   * Added new value for `type` prop: `menu`
 * Datatable
   * Changed `editComponent` prop type from `func` to `node`
   * New `SearchInputProps` and `TableProps` props allow sending props to the `SearchInput` and `Table` components
   * New `wrapComponent` prop allows overriding the scroller that the `Table` is wrapped in by default
   * New `cellStyle` prop of column definitions accepts a function or object to add style to individual cells
   * Added default value for `paginationTerms`
   * New bonus component `DatatableFromArray` is a wrapper for `Datatable` that takes an array of objects and supports pagination
   
1.13.2_2 / 2020-01-20
=====================

 * MuiSuggest: Removed `selectedOption` and `inputFormatted` from the component state
 * TooltipIntl: Fixed bug: `titleValues` prop was not implemented

1.13.2_1 / 2019-10-02
=====================

 * ModalTrigger: Moved inner part of `ModalTrigger` to `Modal`
 * MuiSuggest: Modified component to be able to display pre-formatted values, not just simple strings
 * MuiSuggest: Added `disableSelectOnBlur` prop to prevent selecting the highlighted option on blur
 * MuiSuggest: Added `disableMatchParts` prop to prevent highlighting of matched sub-strings
 * TooltipButton: when passing `true` in `loading` prop the button is disabled... unless you pass `false` in `disabled`
 * FormGroupDefault, FormGroupLine, FormGroupNone : Implemented `group.hidden property`
 * LoadMore: Removed dependency on `react-intl`
 * SearchInput: Removed last usage of `TooltipIntl`
 * Datatable: Added scroller in case the table is too wide
 * StaticText: Added missing form control backed by `MuiText` base control
 * StartAdornment: Fixed bug
 * FormControl, FormComponentDate2, FormComponentText: Added missing form controls
 * Button: Added support for 'default' variant prop value
 * Added `shrinkLabel` option to `inputProperties`
 
1.13.2 / 2019-09-13
===================

 * Forms: Added indicator for required fields
 * Forms: Added support for styling of disabled input
 * LoadMore: Fixed bug that would sometimes display "NaN items"
 * StartAdornment: url and email inputs are now adorned with an icon button link - unless you pass `hideLink: true` in inputProperties
 
1.13.0_1 / 2019-07-23
=====================

 * TooltipButton: Deprecated TooltipIntl and TooltipIconButton in favor of TooltipButton - they will be deleted in Vulcan 1.15.2
 
1.13.0 / 2019-07-19
===================

 * TooltipIntl: Changed display from 'inline-block' to 'inherit' for more flexibility
 
1.12.8_17 / 2019-02-02
======================

 * TooltipIntl: Changed display from 'inline-block' to 'inherit' for more flexibility
 * Countries: Added getRegionLabel function
 
1.12.8_16 / 2019-01-21
======================

 * Countries: Fixed bug in validateRegion
 
1.12.8_15 / 2019-01-21
======================

 * Countries: Fixed bug in validateRegion
 
1.12.8_14 / 2019-01-20
======================

 * Countries: Added validateRegion function, which given a region value or label, will return the region value ('NY' or 'New York' => 'NY)
 * The contents of countries is now exported - this may be refactored out of the core vulcan-material-ui as some point
 
1.12.8_13 / 2019-01-14
======================

 * ModalTrigger: Added boolean dialogOverflow prop for use cases like popups that can go beyond the size of the dialog box
 * MuiSuggest: Fixed bug - The disabled state was not displayed correctly
 * MuiSuggest: Fixed bug - After selecting a suggestion, clicking on the control did not re-open the suggestions menu
 
1.12.8_12 / 2019-01-12
======================

 * Upgraded to Meteor 1.8.0.2
 
1.12.8_11 / 2018-12-21
======================

 * SearchInput: Added install autosize-input to readme
 * Datatable: Fixed sorting delay
 * Datatable: Added tableHeadCell class
 * Datatable: Added cellClass column property, which can be a string or a function: column.cellClass({ column, document, currentUser })
 
1.12.8_10 / 2018-12-09
======================

 * TooltipIntl: Added icon class
 * FormGroupWithLine: Moved caret from the right side to next to the title
 * Changed load_more.loaded_all string
 
1.12.8_9 / 2018-11-26
=====================

 * Fixed bug that displayed invalid total count at the bottom of data tables
 
1.12.8_8 / 2018-11-23
=====================

 * Improved the functionality of the LoadMore component
 * The showNoMore property has been deprecated
 * A showCount property has been added (true by default) that shows a count of loaded and total items
 * The load more icon or button is displayed even when infiniteScroll is enabled
 
1.12.8_7 / 2018-11-10
=====================

 * Fixed bug in Datatable.jsx
 * Updated ReadMe
 
1.12.8_6 / 2018-11-06
=====================

 * Fixed bug in Datatable.jsx
 * Reduced spacing of form components
 
1.12.8_5 / 2018-10-31
=====================

 * Fixed bugs in Datatable pagination
 * Set Datatable paginate prop to false by default
 
1.12.8_4 / 2018-10-31
=====================

 * Removed 'fr_FR.js' from package.js because any french strings loaded activates the french language
 * Fixed delete button and its tooltips positioning in FormSubmit
 * Added pagination to Datatable
 
1.12.8_2 / 2018-10-29
=====================

 * Fixed localization in "clear search" tooltip
 * Added name and aria-haspopup properties to the input component to improve compliance and facilitate UAT
 * Replaced Date, Time and DateTime form controls with native controls as recommended by MUI. 
   The deprecated react-datetime version of the controls are still there as DateRdt, TimeRdt and DateTimeRdt, but they are not registered.
 * Updated readme
 
1.12.8_1 / 2018-10-22
=====================

 * Made form components compatible with new Form.formComponents property
 
1.12.8 / 2018-10-19
===================

 * Made improvements to the search box, including keyboard shortcuts (s: focus search; c: clear search)
 * Added support in TooltipIntl for tooltips in popovers
 * Added action prop to ModalTrigger that enables a parent component to call openModal and closeModal
 * Started using MUI tables in Card component
 * Fixed bugs in MuiSuggest component
