# React Forms

This package provides two components (`NewDocument` and `EditDocument`) that work with the schema extension defined in the [smart-methods](https://github.com/meteor-utilities/smart-methods) package to let you easily generate new document and edit document forms. 

### Install

`meteor add utilities:react-form-containers`

### `NewDocument`

This component takes the following properties:

- `collection`: the collection in which to insert the new document.
- `currentUser`: the current user.
- `errorCallback`: a function to call on error.
- `successCallback`: a function to call on success.
- `methodName`: the name of the method to submit the form to. 
- `labelFunction`: a function that will be called on each field's name to get the label (for example, an internationalization function).

### `EditDocument`

This component takes the same properties as `NewDocument`, plus:

- `document`: the document being edited. 