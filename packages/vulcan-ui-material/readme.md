# vulcan:ui-material 1.16.2

Package initially created by [Erik Dakoda](https://github.com/ErikDakoda) ([`erikdakoda:vulcan-material-ui`](https://github.com/ErikDakoda/vulcan-material-ui))

Replacement for [Vulcan](http://vulcanjs.org/) components using [Material-UI](https://material-ui.com/). 

There are some nice bonus features like a CountrySelect with autocomplete and theming.

All components in vulcan:ui-bootstrap, vulcan:forms and vulcan:accounts have been implemented.


## Installation

To add vulcan-material-ui to an existing Vulcan project, run the following in the console:

``` sh
meteor add vulcan:ui-material

meteor npm install --save @material-ui/core@4.11.0
meteor npm install --save @material-ui/icons@4.9.1
meteor npm install --save @material-ui/styles@4.10.0
meteor npm install --save react-jss@10.4.0
meteor npm install --save mdi-material-ui@6.19.0
meteor npm install --save react-autosuggest@10.0.2
meteor npm install --save autosuggest-highlight@3.1.1
meteor npm install --save react-isolated-scroll@0.1.1
meteor npm install --save react-keyboard-event-handler@1.5.4
meteor npm install --save dompurify
```

This package does not depend on `vulcan:ui-boostrap`, so you can remove it.

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

Material-ui uses context to provide the theme to all its components. By default, the entire app is wrapped with the following component to provide the current theme to the components underneath:

```jsx
const AppThemeProvider = ({ children }) => {
  const theme = getCurrentTheme();
  return (
    <ThemeProvider theme={theme}>
      <JssCleanup>{children}</JssCleanup>
    </ThemeProvider>
  );
};
```

The theme provider is a component registered under `ThemeProvider` so you can replace it as you want with `replaceComponent` from the `vulcan:core` package.

Its props are `apolloClient` (client & server) and `context` (server only, context similar to the graphql requests).

### Example: dynamic theme

Lets say your user schema has a field called "theme" that is a key to one of your registered themes. You can replace the `ThemeProvider` component to give you a dynamic theme as follows:

```jsx
import { ThemeProvider } from '@material-ui/core/styles';
import { JssCleanup } from "meteor/vulcan:ui-material";
import { replaceComponent } from "meteor/vulcan:core";
import { useQuery } from "@apollo/client";

const CustomThemeProvider = ({ children, apolloClient }) => {
  const { currentUser } = useQuery(currentUserThemeQuery, { client: apolloClient });
  const themeKey = currentUser?.theme || defaultThemeKey; // fallback in case of loading or error
  const theme = getTheme(themeKey);
  return (
    <ThemeProvider theme={theme}>
      <JssCleanup>{children}</JssCleanup>
    </ThemeProvider>
  );
};

replaceComponent("ThemeProvider", CustomThemeProvider);
```

This way the theme depends on the cache  and can update dynamically with the user setting. Note the option `client` given to `useQuery` because the ThemeProvider is higher in the react tree than the ApolloClientProvider, so we have to pass the Apollo client manually.

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
      shrinkLabel: true,               // shrink the label even if the field is empty
      hideLink: true,                  // url and email inputs are are adorned with
                                       // an icon button link - unless you hide them
      rows: 10,                        // for textareas you can specify the rows
      variant: 'switch',               // for checkboxgroups you can use either 
                                       //   'checkbox' (default) or 'switch'
      columnClass: 'twoColumn'         // for checkboxgroups you can set columnClass to
                                       //   'twoColumn' or 'threeColumn'; if you don't specify
                                       //   we will guess based on the length of the labels
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
    hidden: function ({ document }) {       // hide the group based on the value of a field
      return !document.listing;
    },
  };
```


## DataTable

You can pass the DataTable component an `editComponent` property in addition to or instead of `showEdit`. Here is a simplified example:

``` jsx
const AgendaJobActions = ({ collection, document }) => {
  const scheduleAgent = () => {
    Meteor.call('scheduleAgent', document.agentId);
  };
  
  return (
    <Components.TooltipIconButton 
      titleId="executions.execute_now"
      icon={<ExecutionsIcon/>}
      onClick={scheduleAgent}
    />;
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

| Value     | Description  |
| --------- | ------------ |
| `dense`   | right cell padding of 16px instead of 56px |
| `flat`    | right cell padding of 16px and nowrap |
| `denser`  | right cell padding of 16px, nowrap, and row height of 40px instead of 56px |

You can also use other string values, as long as you define a `utils` entry named the same + `Table`, for example `myCustomTable`. Check out the sample theme for examples.


## DatatableFromArray

This is a wrapper component for Datatable that enables pagination even if you pass the data as an array instead of a query.

``` jsx
<Components.DatatableFromArray
  columns={[
             { name: 'message', component: TextCell },
             { name: 'type', component: TypeCell },
             { name: 'properties', component: JsonCell, cellClass: classes.widerCell },
           ]}
  data={errorArray}
  paginate={true}
  itemsPerPage={10}
  intlNamespace="shops.reports"
/>
```


## CountrySelect

One of the bonus components is **CountrySelect**, a country autosuggest. For an example, see **CountrySelect**.

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

``` jsx
import Typography from '@material-ui/core/Typography';
import { getCountryLabel } from 'meteor/erikdakoda:vulcan-material-ui';

<Typography variant="subtitle1">
  {getCountryLabel(supplier.country)}
</Typography>
```

## FormSuggest

**FormSuggest** is a base control that you can use to build custom autosuggest controls. Refer to **CountrySelect** for an example.

You can use the following additional props:

| Property              | Type   | Description  |
| --------------------- | ------ | ------------ |
| `limitToList`         | bool   | Don't allow values that are not in the options |
| `disableText`         | bool   | Don't allow editing of the text |
| `disableSelectOnBlur` | bool   | When you blur (tab or click away) the suggest, the highlighted option is selected... unless this is true |
| `showAllOptions`      | bool   | When typing show all options, not just matching ones |
| `disableMatchParts`   | bool   | Prevent highlighting of matched sub-strings |
| `autoComplete`        | string | Autocomplete is turned off by default |

In addition, the `options` that you pass to any select control have additional properties supported by **FormSuggest**:

| Property              | Type   | Description  |
| --------------------- | ------ | ------------ |
| `label`         | string           | The option's text label (standard) |
| `value`         | string or number | The options's value (standard) |
| `iconComponent` | node             | An icon to put to the left of the label (optional) |
| `formatted`     | node or func     | Instead of just an icon, you can pass a component for each options for (optional) |
| `onClick`       | func             | Instead of selecting the option, your onClick handler can do something else, like open an modal to edit the options (optional) |


## TooltipButton

**TooltipButton** is an easy way to add icons, icon buttons, buttons, and static elements with a tooltip. It takes intl string IDs for easy localization.

| Property      | Type    | Description  |
| ------------- | ------- | ------------ |
| `title`       | node    | Tooltip title as a string or a node |
| `titleId`     | string  | Tooltip title as an intl string ID |
| `titleValues` | object  | Values for the intl string |
| `label`       | node    | Button label as a string or node |
| `labelId`     | string  | Button label as an intl string ID |
| `type`        | enum    | `simple`, `fab`, `button`, `submit`, `icon`, `menu` |
| `size`        | enum    | `icon`, `xsmall`, `small`, `medium`, `large` |
| `danger`      | bool    | When `true`, the button is highlighted in red on hover |
| `variant`     | enum    | `text`, `outlined`, `contained` |
| `placement`   | enum    | Tooltip placement: `bottom-end`, `bottom-start`, `bottom`, `left-end`, `left-start`, `left`, `right-end`, `right-start`, `right`, `top-end`, `top-start`, `top` |
| `icon`        | node    | Icon element or component name |
| `loading`     | bool    | When `true`, a loading spinner will be displayed and the button will be disabled |
| `disabled`    | bool    | When `true`, the button will be disabled, when `false` it will be enabled even when loading is `true` |
| `className`   | string  | Class name for the element root |
| `classes`     | object  | Classes to override the defaults |
| `buttonRef`   | func    | Function for grabbing the a reference to the button |
| `enterDelay`  | number  | Tooltip enter delay |
| `leaveDelay`  | number  | Tooltip leave delay |
| `parent`      | enum    | Set parent to `popover` if the button's parent is a popover to increase the z-index of the tooltip |
| `children`    | node    | You can optionally render arbitrary content (instead of a button) |
| `cursor`      | string  | CSS `cursor` property for the button |

See the Storybook example by running the script `storybook-material`.
