# Nova Forms

This package provides a `NovaForm` component that works with the schema extension defined in the [smart-methods](https://github.com/meteor-utilities/smart-methods) package to let you easily generate new document and edit document forms. 

### Install

`meteor add nova:forms`

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
    // no insertableIf or editableIf means this field won't appear in forms
  },
  title: {
    type: String,
    optional: false,
    max: 500,
    insertableIf: isLoggedIn,
    editableIf: isOwner,
    control: "text",
    order: 1
  },
  body: {
    type: String,
    optional: true,
    max: 3000,
    insertableIf: isLoggedIn,
    editableIf: isOwner,
    control: BodyFormControl,
    order: 2
  },
  sticky: {
    type: Boolean,
    optional: true,
    defaultValue: false,
    insertableIf: isAdmin,
    editableIf: isAdmin,
    control: "checkbox",
    order: 3
  },
}
```

New document form:

```jsx
<NovaForm 
  collection={Posts}
  currentUser={currentUser},
  methodName="posts.new"
/>
```

Edit document form:

```jsx
<NovaForm 
  collection={Posts}
  currentUser={currentUser},
  methodName="posts.edit",
  document={post},
  labelFunction={capitalize}
  successCallback={closeModal}
/>
```

### Props

###### `collection`

The collection in which to edit or insert a document.

###### `document`

If present, the document to edit. If not present, the form will be a “new document” form. 

###### `currentUser`

The current user.

###### `submitCallback()`

A callback called on form submission.

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

###### `insertableIf(user)`

A function called on the `user` performing the operation, should return `true` or `false`. When generating a form for inserting new documents, the form will contain all the fields that return `true` for the current user. 

###### `editableIf(user, document)`

Called on the `user` performing the operation, and the `document` being operated on, and should return `true` or `false`. When generating a form for editing existing documents, the form will contain all the fields that return `true` for the current user. 

###### `control`

Either a text string (one of `text`, `textarea`, `checkbox`, `checkboxgroup`, `radiogroup`, or `select`) or a React component. 

###### `order`

A number corresponding to the position of the property's field inside the form. 

### Context

The main `NovaForm` components makes the following objects available as context to all its children:

###### `prefilledValues`

An object containing optional prefilled properties. 

###### `addToPrefilledValues({name: value})`

A function that takes a property, and adds it to the `prefilledValues` object. 

###### `throwError({content, type})`

A callback function that can be used to throw an error. 

