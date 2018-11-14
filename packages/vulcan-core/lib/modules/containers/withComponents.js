/**
 * This HOC will load the global Components.
 * If a "components" prop is passed, it will be merged with the global Components.
 * 
 * This allow local replacement of global components, for example if 
 * you want a specific submit button but only for one specific form.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { mergeWithComponents } from 'meteor/vulcan:lib';

const withComponents = C => {
    const WrappedComponent = ({ components, formComponents, ...otherProps }) => {
        //if (formComponents){
        //    console.warn('"formComponents" prop is deprecated, use "components" prop instead (same behaviour)');
        //}
        const Components = mergeWithComponents(components || formComponents);
        return <C Components={Components} {...otherProps} />;
    };
    WrappedComponent.displayName = `withComponents(${C.displayName})`;
    WrappedComponent.propTypes = {
        formComponents: PropTypes.object,
        components: PropTypes.object
    };
    return WrappedComponent;
};

export default withComponents;