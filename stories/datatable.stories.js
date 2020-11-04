import React from 'react';
import { storiesOf } from '@storybook/react';
import { Components } from 'meteor/vulcan:core';
import 'meteor/vulcan:core';

import { withKnobs, text, boolean, select, number, object } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';


const DatatableContentsStories = storiesOf('Core/Datatable/DatatableContents', module);
DatatableContentsStories.addDecorator(withKnobs);


const defaultProps = {
    DatatableContents: {
        title: 'foobar',
        results: [{ 'foo': 'bar', 'answer': 42 }, { 'foo': 'bar1', 'answer': 4 }],
        columns: [{
            label: 'foo',
            name: 'foo',
        }, {
            label: 'answer',
            name: 'answer',
        }],
        Components: Components,
    },
    DatatableContentsWithoutColumns: {
        title: 'foobar',
        results: [{ 'foo': 'bar', 'answer': 42 }, { 'foo': 'bar1', 'answer': 4 }],
        Components: Components,
    },
    DatatableAbove: {
        showSearch: true,
        showNew: true,
        canInsert: true,
        Components: Components

    }
};

DatatableContentsStories
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
        <Components.DatatableContents
          {...defaultProps.DatatableContents}
          loading={true}
        />
    ))
    .add('DatatableContents - error', () => (
        <Components.DatatableContents
            {...defaultProps.DatatableContents}
            error={{ message: 'foo' }}
        />
    ))

    // NOT WORKING => supposed to be checking dans DatatableContents   
    // if no columns are provided, default to using keys of first array item
    // if (!columns) {
    //   columns = Object.keys(results[0]).filter(k => k !== '__typename');
    // }

    .add('DatatableContents - withoutColumns', () => (
        <Components.DatatableContents
            {...defaultProps.DatatableContentsWithoutColumns}
        />
    ))

    //NOT PERFECT => The Edit part in the DatatableContentsHeadLayout doesn't appear
    .add('DatatableContents - showEdit', () => (
        <Components.DatatableContents
            {...defaultProps.DatatableContents}
            showEdit={true}
        />
    ))
    // DOES NOT WORK => PR to do on the ShowNew Props 
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
            />
        );
    })

    .add('DatableEmpty ', () => (
        < Components.DatatableEmpty />
    ))

    // TO FINISH => TRYING TO MAKE APPEAR THE DATATABLE LOADMORE BUTTON 
    .add(' DatatableContents - DatatableLoadMoreButton ', () => {
        return (<div>
            <Components.DatatableContents
                {...defaultProps.DatatableContents}
            />
            <p>{defaultProps.DatatableContents.results.length}</p></div >
        );
    });


const DatatableAboveStories = storiesOf('Core/Datatable/DatatableAbove', module);
DatatableAboveStories.addDecorator(withKnobs);

DatatableAboveStories
    // NOT PERFECT 1/ The value props is not there & 2/ The placeholder props is a string while in the component it's a 
    // placeholder={`${intl.formatMessage({
    //    id: 'datatable.search',
    //    defaultMessage: 'Search',
    //  })}…`}
    .add('DatatableAboveSearchInput - interactive ', () => (
        <Components.DatatableAboveSearchInput
            Components={Components}
            placeholder={text('placeholder', 'placeholder')}
            type={text('text', 'text')}
            onChange={action('onChange')}

        />
    ))

    .add('NewButton ', () => (
        <Components.NewButton
        />
    ))


    .add('DatatableAbove ', () => (
        <Components.DatatableAbove
            {...defaultProps.DatatableAbove}>
        </Components.DatatableAbove>

    ))

    .add('DatatableAbove - Interactive ', () => {
        const showSearch = boolean('showSearch', true);
        const showNew = boolean('showNew', true);
        const canInsert = boolean('canInsert', true);
        return (
            <Components.DatatableAbove
                showSearch={showSearch}
                showNew={showNew}
                canInsert={canInsert}
                Components={Components}
            >
            </Components.DatatableAbove>

        );
    })


   
