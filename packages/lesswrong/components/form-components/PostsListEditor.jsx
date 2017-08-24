import React, {Component} from 'react';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';
import { registerComponent, Components, withCurrentUser } from 'meteor/vulcan:core';
import IconButton from 'material-ui/IconButton';
import RemoveIcon from 'material-ui/svg-icons/content/remove-circle-outline';
import DragIcon from 'material-ui/svg-icons/editor/drag-handle';


const DragHandle = SortableHandle(() => <DragIcon className="drag-handle"/>); // This can be any component you want


const SortableItem = SortableElement(({postId, currentUser, removeItem}) =>
  <li className="posts-list-editor-item">
    <Components.PostsItemWrapper documentId={postId} currentUser={currentUser} removeItem={removeItem} />
  </li>
);

const SortableList = SortableContainer(({items, currentUser, removeItem}) => {
  return (
    <div>
      {items.map((postId, index) => (
        <SortableItem key={`item-${index}`} removeItem={removeItem} index={index} postId={postId} currentUser={currentUser}/>
      ))}
    </div>
  );
});

class PostsListEditor extends Component {
  constructor(props, context) {
    super(props, context);
    const fieldName = props.name;
    let postIds = [];
    if (props.document[fieldName]) {
      postIds = JSON.parse(JSON.stringify(props.document[fieldName]));
    }
    this.state = {
      postIds: postIds,
    }
    const addValues = this.context.addToAutofilledValues;
    addValues({[fieldName]: postIds});

    const addToSuccessForm = this.context.addToSuccessForm;
    addToSuccessForm((results) => this.resetPostIds(results));
  }
  onSortEnd = ({oldIndex, newIndex}) => {
    const fieldName = this.props.name;
    const addValues = this.context.addToAutofilledValues;
    const newIds = arrayMove(this.state.postIds, oldIndex, newIndex);
    this.setState({
      postIds: newIds,
    });
    addValues({[fieldName]: newIds});
  };
  addPostId = (postId) => {
    const newIds = [...this.state.postIds, postId];
    this.setState({
      postIds: newIds,
    })
    const fieldName = this.props.name;
    const addValues = this.context.addToAutofilledValues;
    addValues({[fieldName]: newIds});
  }
  removePostId = (postId) => {
    const newIds = _.without(this.state.postIds, postId);
    this.setState({
      postIds: newIds,
    })
    const fieldName = this.props.name;
    const addValues = this.context.addToAutofilledValues;
    addValues({[fieldName]: newIds});
  }
  resetPostIds = (args) => {
    this.setState({
      postIds: [],
    })
    return args;
  }

  render() {
    return <div className="posts-list-editor">
      <SortableList items={this.state.postIds} onSortEnd={this.onSortEnd} currentUser={this.props.currentUser} removeItem={this.removePostId} />
      <Components.PostsSearchAutoComplete clickAction={this.addPostId} />
    </div>
  }
}

//

PostsListEditor.contextTypes = {
  addToAutofilledValues: React.PropTypes.func,
  addToSuccessForm: React.PropTypes.func,
};

registerComponent("PostsListEditor", PostsListEditor, withCurrentUser);

export default withCurrentUser(PostsListEditor);
