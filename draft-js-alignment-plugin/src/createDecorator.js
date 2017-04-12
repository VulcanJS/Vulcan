import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const getDisplayName = (WrappedComponent) => {
  const component = WrappedComponent.WrappedComponent || WrappedComponent;
  return component.displayName || component.name || 'Component';
};

export default ({ store }) => (WrappedComponent) => class BlockAlignmentDecorator extends Component {
  static displayName = `BlockDraggable(${getDisplayName(WrappedComponent)})`;
  static WrappedComponent = WrappedComponent.WrappedComponent || WrappedComponent;

  componentDidUpdate = () => {
    if (this.props.blockProps.isFocused && this.props.blockProps.isCollapsedSelection) {
      // TODO figure out if and how to achieve this without fetching the DOM node
      // eslint-disable-next-line react/no-find-dom-node
      const blockNode = ReactDOM.findDOMNode(this);
      const boundingRect = blockNode.getBoundingClientRect();
      store.updateItem('setAlignment', this.props.blockProps.setAlignment);
      store.updateItem('alignment', this.props.blockProps.alignment);
      store.updateItem('boundingRect', boundingRect);
      store.updateItem('visibleBlock', this.props.block.getKey());
    // Only set visibleBlock to null in case it's the current one. This is important
    // in case the focus directly switches from one block to the other. Then the
    // Alignment tool should not be hidden, but just moved.
    } else if (store.getItem('visibleBlock') === this.props.block.getKey()) {
      store.updateItem('visibleBlock', null);
    }
  }

  render() {
    const {
      blockProps,
      style,
      // using destructuring to make sure unused props are not passed down to the block
      ...elementProps
    } = this.props;
    const alignment = blockProps.alignment;
    let newStyle = style;
    if (alignment === 'left') {
      newStyle = { ...style, float: 'left' };
    } else if (alignment === 'right') {
      newStyle = { ...style, float: 'right' };
    } else if (alignment === 'center') {
      newStyle = { ...style, marginLeft: 'auto', marginRight: 'auto', display: 'block' };
    }

    return (
      <WrappedComponent
        {...elementProps}
        blockProps={blockProps}
        style={newStyle}
      />
    );
  }
};
