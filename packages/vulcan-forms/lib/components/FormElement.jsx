import React from 'react';
import { registerComponent } from 'meteor/vulcan:core';

// this component receives a ref, so it must be a class component
class FormElement extends React.Component {
    render(){
        const { children, ...otherProps } = this.props;
        return <form {...otherProps}>{children}</form>;
    }
}
registerComponent({
    name:'FormElement',
    component: FormElement
});