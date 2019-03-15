import React from 'react';
import { registerComponent } from 'meteor/vulcan:core';

const FormElement = ({children}) => <form>{children}</form>;
registerComponent({
    name:'FormElement',
    component: FormElement
});