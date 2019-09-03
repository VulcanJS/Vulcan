1.13.0_1 / 2019-07-23
=====================

 * TooltipButton: Deprecated TooltipIntl and TooltipIconButton in favor of TooltipButton - they will be deleted in Vulcan 1.15.0
 
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
