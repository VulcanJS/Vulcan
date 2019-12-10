import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Components } from 'meteor/vulcan:core';
import 'meteor/vulcan:forms-upload/lib/modules.js';
import PropTypes from 'prop-types';

// @see https://reactjs.org/docs/legacy-context.html
// needed for legacy components
const makeLegacyContextProvider = (value, shape) => {
    class LegacyContextProvider extends React.Component {
        getChildContext() {
            return value;
        }
        render() {
            return <div>{this.props.children}</div>;
        }
    }
    LegacyContextProvider.childContextTypes = shape;
    return LegacyContextProvider;
};

const contextDecorator = story => {
    const Provider = makeLegacyContextProvider({
        addToSubmitForm: action('addToSubmitForm'),
    }, {
        addToSubmitForm: PropTypes.func
    });
    return (
        <Provider>
            {story()}
        </Provider>
    );
};

storiesOf('Core/FormUpload', module)
    .addDecorator(contextDecorator)
    .add('UploadInput', () => {
        const Provider = makeLegacyContextProvider({
            addToSubmitForm: action('addToSubmitForm'),
        }, {
            addToSubmitForm: PropTypes.func
        });
        return (
            <Provider>
                <Components.Upload />
            </Provider >
        );
    });


