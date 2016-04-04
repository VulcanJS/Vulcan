# React Forms

This package provides a `NovaForm` component that works with the schema extension defined in the [smart-methods](https://github.com/meteor-utilities/smart-methods) package to let you easily generate new document and edit document forms. 

### Install

`meteor add nova:forms`

### Props

#### collection `object.isRequired`

The collection in which to edit or insert a document.

#### document `object`

If present, the document to edit. If not present, the form will be a “new document” form. 

#### currentUser `object`

The current user.

#### submitCallback() `func`

A callback called on form submission.

#### successCallback(document) `func`

A callback called on method success.

#### errorCallback(document, error) `func`

A callback called on method failure.

#### methodName `string`

The name of the Meteor method to call.

#### labelFunction `func`

A function to call on field names to get the label.

#### prefilledProps `object`

A set of props to prefill for new documents. 