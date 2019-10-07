import React from 'react';
import { storiesOf } from '@storybook/react';
import { Components } from 'meteor/vulcan:core';
import 'meteor/vulcan:core';

import { withKnobs, text, boolean, select, number, object } from '@storybook/addon-knobs';

const DatatableStories = storiesOf('Core/Datatable', module);
DatatableStories.addDecorator(withKnobs);

const defaultProps = {
    DatatableContents: {
        results: [{ 'foo': 'bar', 'answer': 42 }]
        /*columns={[{

        }, {

        }]}*/
    }
};
DatatableStories
    .add('DatatableContents - interactive', () => {
        const title = text('title', 'My datatable');

        return (
            <Components.DatatableContents
                {...defaultProps.DatatableContents}
                title={title}
            />
        );
    })
    .add('DatatableContents - loading', () => (
        <Components.DatatableContents loading={true} />
    ));