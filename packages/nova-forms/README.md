# React Forms

This package provides a `NovaForm` component that works with the schema extension defined in the [smart-methods](https://github.com/meteor-utilities/smart-methods) package to let you easily generate new document and edit document forms. 

### Install

`meteor add nova:forms`

### Props

#### `collection`

The collection in which to edit or insert a document.

#### `document`

If present, the document to edit. If not present, the form will be a “new document” form. 

#### `currentUser`

The current user.

#### `submitCallback()`

A callback called on form submission.

#### `successCallback(document)`

A callback called on method success.

#### `errorCallback(document, error)`

A callback called on method failure.

#### `methodName`

The name of the Meteor method to call.

#### `labelFunction`

A function to call on field names to get the label.

#### `prefilledProps`

A set of props to prefill for new documents. 

### Collection Schema

This package generates forms based on the following special schema properties (see also the [Smart Methods](https://github.com/meteor-utilities/smart-methods) package:

#### `insertableIf(user)`

A function called on the `user` performing the operation, should return `true` or `false`. When generating a form for inserting new documents, the form will contain all the fields that return `true` for the current user. 

#### `editableIf(user, document)`

Called on the `user` performing the operation, and the `document` being operated on, and should return `true` or `false`. When generating a form for editing existing documents, the form will contain all the fields that return `true` for the current user. 

#### `control`

Either a text string (one of `text`, `textarea`, `checkbox`, `checkboxgroup`, `radiogroup`, or `select`) or a React component. 

#### `order`

A number corresponding to the position of the property's field inside the form. 

### Context

The main `NovaForm` components makes the following objects available as context to all its children:

#### `currentValues`

An object containing all the current values of the form.

#### `throwError({content, type})`

A callback function that can be used to throw an error. 