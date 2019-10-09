import React from 'react';
import { storiesOf } from '@storybook/react';
import { Components } from 'meteor/vulcan:core';
import 'meteor/vulcan:core';

import { withKnobs, text, boolean, select, number, object } from '@storybook/addon-knobs';


const DatatableStories = storiesOf('Core/Datatable', module);
DatatableStories.addDecorator(withKnobs);


const defaultProps = {
    DatatableContents: {
        title: 'foobar',
        results: [{ 'foo': 'bar', 'answer': 42 }],
        columns: [{
            label: 'Foo',
            name: 'foo',
        }, {
            label: 'answer',
            name: 'answer',
        }]
    }
};

DatatableStories
    .add('DatatableContents - interactive', () => {
        const title = text('title', 'My datatable');
        const results = [{ 'foo': 'bar', 'answer': 42 }];
        const columns = [{
            label: 'Foo',
            name: 'foo',
            order: 1
        }, {
            label: 'answer',
            name: 'answer',
            order: 2
        }];
        return (
            <Components.DatatableContents
                {...defaultProps.DatatableContents}
                title={title}
                results={object('results', results)}
                columns={object('columns', columns)}

            />
        );
    })
    .add('DatatableContents - loading', () => (
        <Components.DatatableContents loading={true} />
    ))
    .add('DatatableContents - error', () => (
        <Components.DatatableContents
            {...defaultProps.DatatableContents}
            error={{ message: 'foo' }}
        />
    ))
    .add('DatatableContents - showEdit', () => (
        <Components.DatatableContents
            {...defaultProps.DatatableContents}
            showEdit={true}
        />
    ))
    // DOES NOT WORK 
    .add('DatatableContents - showNew', () => (
        <Components.DatatableContents
            {...defaultProps.DatatableContents}
            showNew={true}
        />
    ))
    // DOES NOT WORK 
    .add('DatatableContents - Display DatableEmpty', () => {
        return (
            < Components.DatatableContents
                {...defaultProps.DatatableContents}
                results={[]}
            />);
    })

    .add('DatatableContents - DatableEmpty Component', () => (
        < Components.DatatableEmpty />
    ))


    ;