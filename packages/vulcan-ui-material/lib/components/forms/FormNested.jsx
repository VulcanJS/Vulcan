import React from 'react';
import { replaceComponent } from 'meteor/vulcan:core';
import Delete from 'mdi-material-ui/Delete';
import Plus from 'mdi-material-ui/Plus';


const IconRemove = () => <Delete/>;

replaceComponent('IconRemove', IconRemove);

const IconAdd = () => <Plus/>;

replaceComponent('IconAdd', IconAdd);
