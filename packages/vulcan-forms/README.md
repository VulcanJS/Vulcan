# Vulcan Forms

This package provides a `SmartForm` component that works with the schema extension defined in the [smart-methods](https://github.com/meteor-utilities/smart-methods) package to let you easily generate new document and edit document forms. 

### Install

`meteor add vulcan:forms`

(note: package is not published yet)

### Features

This package can generate new document and edit document forms from a [SimpleSchema](https://github.com/aldeed/meteor-simple-schema) schema. Features include:

- Error handling.
- Bootstrap-compatible.
- Cross-component communciation (prefill a field based on another).
- Callbacks on form submission, success, and failure.
- Support for basic form controls (input, textarea, radio, etc.).
- Support for custom form controls.
- Submission to Meteor methods. 

### NPM Dependencies

```
react react-intl formsy-react react-bootstrap formsy-react-components
```

You also need to load Bootstrap's CSS separately. 

### Usage

Example schema:

```js

import BodyFormControl from './components/BodyFormControl.jsx';

const isLoggedIn = (user) => !!user;
const isOwner = (user, document) => user._id === document.userId;
const isAdmin = (user) => user.isAdmin;

const PostsSchema = new SimpleSchema({
  postedAt: {
    type: Date,
    optional: true
    // no insertableBy or editableBy means this field won't appear in forms
  },
  title: {
    type: String,
    optional: false,
    max: 500,
    insertableBy: isLoggedIn,
    editableBy: isOwner,
    control: "text",
    order: 1
  },
  body: {
    type: String,
    optional: true,
    max: 3000,
    insertableBy: isLoggedIn,
    editableBy: isOwner,
    control: BodyFormControl,
    order: 2
  },
  sticky: {
    type: Boolean,
    optional: true,
    defaultValue: false,
    insertableBy: isAdmin,
    editableBy: isAdmin,
    control: "checkbox",
    order: 3
  },
}
```

New document form:

```jsx
<Components.SmartForm 
  collection={Posts}
  methodName="posts.new"
/>
```

Edit document form:

```jsx
<Components.SmartForm 
  collection={Posts}
  methodName="posts.edit"
  document={post}
  labelFunction={capitalize}
  successCallback={closeModal}
/>
```

### Props

###### `collection`

The collection in which to edit or insert a document.

###### `schema`

If you prefer, you can also specify a schema instead of a collection.

###### `document`

If present, the document to edit. If not present, the form will be a “new document” form. 

###### `currentUser`

The current user.

###### `submitCallback(data)`

A callback called on form submission on the form data. Should return the `data` object as well.

###### `successCallback(document)`

A callback called on method success.

###### `errorCallback(document, error)`

A callback called on method failure.

###### `cancelCallback()`

If provided, will show a "cancel" link next to the form's submit button. 

###### `methodName`

The name of the Meteor method to call.

###### `labelFunction`

A function to call on field names to get the label.

###### `prefilledProps`

A set of props to prefill for new documents. 

### Collection Schema

This package generates forms based on the following special schema properties (see also the [Smart Methods](https://github.com/meteor-utilities/smart-methods) package:

###### `insertableBy(user)`

A function called on the `user` performing the operation, should return `true` or `false`. When generating a form for inserting new documents, the form will contain all the fields that return `true` for the current user. 

###### `editableBy(user, document)`

Called on the `user` performing the operation, and the `document` being operated on, and should return `true` or `false`. When generating a form for editing existing documents, the form will contain all the fields that return `true` for the current user. 

###### `control`

Either a text string (one of `text`, `textarea`, `checkbox`, `checkboxgroup`, `radiogroup`, or `select`) or a React component. 

###### `order`

A number corresponding to the position of the property's field inside the form. 

###### `group`

An optional object containing the group/section/fieldset in which to include the form element. Groups have `name`, `label`, and `order` properties.

For example:

```js
postedAt: {
  type: Date,
  optional: true,
  insertableBy: Users.isAdmin,
  editableBy: Users.isAdmin,
  control: "datetime",
  group: {
    name: "admin",
    label: "Admin Options",
    order: 2
  }
},
```

Note that fields with no groups are always rendered first in the form. 

###### `placeholder`

A placeholder value for the form field. 

###### `beforeComponent`

A React component that will be inserted just before the form component itself.

###### `afterComponent`

A React component that will be inserted just after the form component itself.

### Context

The main `SmartForm` components makes the following objects available as context to all its children:

###### `autofilledValues`

An object containing optional autofilled properties. 

###### `addToAutofilledValues({name: value})`

A function that takes a property, and adds it to the `autofilledValues` object. 

###### `throwError(errorMessage)`

A callback function that can be used to throw an error. 

###### `getDocument()`

A function that lets you retrieve the current document from a form component.

### Handling Values

The component handles three different layers of input values:

- The value stored in the database (when editing a document).
- The value being currently inputted in the form element.
- An “autofilled” value, typically provided by an *other* form element (i.e. autofilling the post title from its URL).

The highest-priority value is the user input. If there is no user input, we default to the database value provided by the `props`. And if that one is empty too, we then look for autofilled values. 

### i18n

This package uses [React Intl](https://github.com/yahoo/react-intl/) to automatically translate all labels. In order to do so it expects an `intl` object ot be passed as part of its context. For example, in a parent component: 

```
getChildContext() {
  const intlProvider = new IntlProvider({locale: myLocale}, myMessages);
  const {intl} = intlProvider.getChildContext();
  return {
    intl: intl
  };
}
```
