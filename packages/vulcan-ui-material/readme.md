# vulcan:ui-material 1.13.0_1

Package initially created by [Erik Dakoda](https://github.com/ErikDakoda) ([`erikdakoda:vulcan-material-ui`](https://github.com/ErikDakoda/vulcan-material-ui))

Replacement for [Vulcan](http://vulcanjs.org/) components using [Material-UI](https://material-ui.com/). 

There are some nice bonus features like a CountrySelect with autocomplete and theming.

All components in vulcan:ui-bootstrap, vulcan:forms and vulcan:accounts have been implemented except for Icon.


## Installation

To add vulcan-material-ui to an existing Vulcan project, run the following in the console:

``` sh
meteor add vulcan:ui-material

meteor npm install --save @material-ui/core@3.9.3
meteor npm install --save react-jss
meteor npm install --save mdi-material-ui
meteor npm install --save react-autosuggest
meteor npm install --save autosuggest-highlight
meteor npm install --save react-isolated-scroll
meteor npm install --save-exact react-keyboard-event-handler@1.3.2
#meteor npm install --save autosize-input
meteor npm install --save moment-timezone
```

This package no longer depends on `vulcan:ui-boostrap`, so you can remove it.

To activate the example layout copy the three components to your project and import them:

``` javascript
import './example/Header';
import './example/Layout';
import './example/SideNavigation';
```

## Theming

For an example theme see `modules/sampleTheme.js`. For a complete list of values you can customize, 
see the [MUI Default Theme](https://material-ui-next.com/customization/default-theme/). 

Register your theme in the Vulcan environment by giving it a name: `registerTheme('MyTheme', theme);`. 
You can have multiple themes registered and you can specify which one to use in your settings file using the `muiTheme` **public** setting.

In addition to the Material UI spec, I use a `utils` section in my themes where I place global variables for reusable styles. 
For example the sample theme contains 

```
const theme = {
  
  . . .
  
  utils: {
    
    tooltipEnterDelay: 700,
    
    errorMessage: {
      textAlign: 'center',
      backgroundColor: red[500],
      color: 'white',
      borderRadius: '4px',
    },
    
    . . .
    
    // additional utils definitions go here
    
  },
  
};
```

You can use tooltipEnterDelay (or any other variable you define in utils) anywhere you include the withTheme HOC. See `/components/bonus/TooltipButton.jsx` for an example.

You can use errorMessage (or any other style fragment you define in utils) anywhere you include the withStyles HOC. See `/components/accounts/Form.jsx` for an example.

## Server Side Rendering (SSR)

Material UI and Vulcan support SSR, but this is a complex beast with pitfalls. Sometimes you will see a warning like this:

`Warning: Prop className did not match. Server: "MuiChip-label-131" Client: "MuiChip-label-130"`

Sometimes the React rendered on the server and the client don't match exactly and this causes a problem with [JSS](https://material-ui-next.com/customization/css-in-js/#jss). This is a complicated issue that has multiple causes and I will be working on solving each of the issues causing this over time.

Your pages should still render correctly, but there may be a blink and redraw when the first page after SSR loads in the browser.

In your own code, make sure that your components will render the same on the server and the client. This means not referring to client-side object such as `window`, `document` or `jQuery`. If you have a misbehaving component, try wrapping it in a [NoSsr](https://material-ui.com/components/no-ssr/) component.

## Form Controls

You can pass a couple of extra options to inputs from the `form` property of your schema:

```
  userKey: {
    type: String,
    label: 'User key',
    description: 'The user’s key',
    optional: true,
    hidden: function ({ document }) {
      return !document.platformId || !document.usePlatformApp;
    },
    inputProperties: {
      autoFocus: true,                 // focus this input when the form loads
      addonBefore: <KeyIcon/>,         // adorn the start of the input
      addonAfter: <KeyIcon/>,          // adorn the end of the input
      inputClassName: 'halfWidthLeft', // use 'halfWidthLeft' or 'halfWidthRight'
                                       //   to display two controls side by side
      hideLabel: true,                 // hide the label
      rows: 10,                        // for textareas you can specify the rows
      variant: 'switch',               // for checkboxgroups you can use either 
                                       //   'checkbox' (default) or 'switch'
      inputProps: { step: 'any' }      // Attributes applied to the input element, for
                                       //   ex pass the step attr to a number input
    },
    group: platformGroup,
    canRead: ['members'],
    canCreate: ['members'],
    canUpdate: ['members'],
  },
```

## Form Groups

You can pass a couple of extra options to form groups as well:

``` javascript
  const platformGroup = {
    name: 'shops.platform',
    order: 4,
    beforeComponent: 'ShopsPlatformTitle',  // component to put at the top of the form group
    afterComponent:  'ShopsConnectButtons', // component to put at the bottom of the form group
  };
```

## DataTable

You can pass the DataTable component an `editComponent` property in addition to or instead of `showEdit`. Here is a simplified example:

``` javascript
const AgendaJobActions = ({ collection, document }) => {
  const scheduleAgent = () => {
    Meteor.call('scheduleAgent', document.agentId);
  };
  
  return <Components.TooltipIconButton titleId="executions.execute_now"
                                       icon={<Components.ExecutionsIcon/>}
                                       onClick={scheduleAgent}/>;
};

AgendaJobActionsInner.propTypes = {
  collecion: PropTypes.object.isRequired,
  document: PropTypes.object.isRequired,
};

<Components.Datatable
  editComponent={AgendaJobActions}
  collection={AgendaJobs}
  //...
/>
```

You can also control the spacing of the table cells using the `dense` property. Valid values are:

| Value   | Description  |
| ------- | ------------ |
| dense   | right cell padding of 16px instead of 56px |
| flat    | right cell padding of 16px and nowrap |
| denser  | right cell padding of 16px, nowrap, and row height of 40px instead of 56px |

You can also use other string values, as long as you define a `utils` entry named the same + `Table`, for example `myCustomTable`. Check out the sample theme for examples.


## CountrySelect

One of the bonus components is **CountrySelect**, a country autosuggest.

```
  country: {
    type: String,
    label: 'Country',
    input: 'CountrySelect',
    canRead: ['guests'],
    canCreate: ['members'],
    canUpdate: ['members'],
  },
```

Countries are stored as their 2-letter country codes. I have included a helper function for displaying the country name:

``` javascript
import Typography from '@material-ui/core/Typography';
import { getCountryLabel } from 'meteor/erikdakoda:vulcan-material-ui';

<Typography variant="subtitle1">
  {getCountryLabel(supplier.country)}
</Typography>
```


## TooltipButton

**TooltipButton** is an easy way to add icons, icon buttons, buttons, and static elements with a tooltip. It takes intl string IDs for easy localization.

| Property    | Type    | Description  |
| ----------- | ------- | ------------ |
| title       | node    | Popover title as a string or a node |
| titleId     | string  | Popover title as an intl string ID |
| titleValues | object  | Values for the intl string |
| label       | node    | Button label as a string or node |
| labelId     | string  | Button label as an intl string ID |
| type        | enum    | `simple`, `fab`, `button`, `submit`, `icon` |
| size        | enum    | `icon`, `xsmall`, `small`, `medium`, `large` |
| variant     | enum    | `text`, `outlined`, `contained` |
| placement   | enum    | Tooltip placement: `bottom-end`, `bottom-start`, `bottom`, `left-end`, `left-start`, `left`, `right-end`, `right-start`, `right`, `top-end`, `top-start`, `top` |
| icon        | node    | Icon element or component name |
| loading     | bool    | When true, a loading spinner will be displayed |
| disabled    | bool    | When true, the button will be disabled |
| className   | string  | Class name for the element root |
| classes     | object  | Classes to override the defaults |
| buttonRef   | func    | Function for grabbing the a reference to the button |
| enterDelay  | number  | Tooltip enter delay |
| leaveDelay  | number  | Tooltip leave delay |
| parent      | enum    | Set parent to `popover` if the button's parent is a popover to increase the z-index of the tooltip |
| children    | node    | You can optionally render arbitrary content (instead of a button) |

See the Storybook example by running the script `storybook-material`.
