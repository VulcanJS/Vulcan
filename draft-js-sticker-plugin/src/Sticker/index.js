import React, { Component } from 'react';

export default class Sticker extends Component {

  remove = (event) => {
    // Note: important to avoid a content edit change
    event.preventDefault();
    event.stopPropagation();

    this.props.blockProps.onRemove(this.props.block.getKey());
  };

  render() {
    const { block, stickers, theme = {}, contentState } = this.props;
    const removeButton = (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <span
        className={theme.stickerRemoveButton}
        onClick={this.remove}
        role="button"
      >
        ✕
      </span>
    );

    const data = contentState.getEntity(block.getEntityAt(0)).getData();
    return (
      <figure
        contentEditable={false}
        data-offset-key={`${block.get('key')}-0-0`}
        className={theme.sticker}
      >
        <img
          className={theme.stickerImage}
          src={stickers.getIn(['data', data.id, 'url'])}
          role="presentation"
        />
        {this.props.attachRemoveButton ? removeButton : null}
      </figure>
    );
  }
}
