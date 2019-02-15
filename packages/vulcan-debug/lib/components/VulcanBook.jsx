/**
 * Display registered story
 * 
 * Example:
 * addCallback('stories.register', (stories) => (
 * [
 *  ...stories, // other registered stories
 *  {
 *      group:'MyComponent',
 *      name:'My Component Without data',
 *      render: () => <MyComponent data={[]} />
 *  }
 * ]))
 * 
 * Then access /debug/vulcanbook to see the stories
 * 
 * TODO:
 * - handle hocs
 * - defer component loading?
 * - better navigation between stories
 * - create stories for all core components
 */
import React, { PureComponent } from 'react';
import _groupBy from 'lodash/groupBy';
import { registerComponent } from 'meteor/vulcan:lib';
import withStories from '../hocs/withStories';

class VulcanBook extends PureComponent {
    constructor() {
        super();
        this.state = { selectedGroupName: null };
    }
    toggleGroup = (groupName) => {
        if (groupName == this.state.selectedGroupName) {
            this.setState({ selectedGroupName: null });
        } else {
            this.setState({ selectedGroupName: groupName });
        }
    }
    render() {
        const { stories } = this.props;
        const { selectedGroupName } = this.state;
        const storiesByGroup = _groupBy(stories, 'group');
        return (
            <div>
                <h1>Vulcan Book</h1>
                <div style={{ display: 'flex', width: '100%', flexDirection: 'row' }}>
                    <Menu
                        groups={Object.keys(storiesByGroup)}
                        selectedGroupName={selectedGroupName}
                        selectGroup={this.toggleGroup} />
                    <View group={selectedGroupName && storiesByGroup[selectedGroupName]} groupName={selectedGroupName} />
                </div>
            </div>
        );
    }
}
const Menu = ({ groups, selectGroup, selectedGroupName }) => (
    <div style={{ minWidth: '250px', maxWidth: '400px', backgroundColor: '#dddddd' }}>{
        groups.map((groupName) => (
            <div key={groupName}>
                <div>
                    <button
                        style={{ width: '100%' }}
                        onClick={() => selectGroup(groupName)}>{
                            groupName === selectedGroupName
                                ? <strong>{groupName}</strong>
                                : groupName
                        }</button>
                </div>
            </div>
        ))
    }</div>
);
const View = ({ group, groupName }) => (
    <div style={{ marginLeft: '8px' }}>
        {
            group
                ? (
                    <div>

                        {/*<div><h2>{groupName}</h2></div>*/}
                        {
                            group.map((story, idx) => (
                                <div key={idx} style={{marginBottom: '24px'}}>
                                    <div style={{ borderBottom: '2px solid #222222' }}>
                                        <h3>{story.name}</h3>
                                    </div>
                                    <div>
                                        {story.render()}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )
                : 'Click on a group to display the stories'
        }
    </div>

);


registerComponent({
    name: 'VulcanBook',
    component: VulcanBook,
    hocs: [withStories]
});