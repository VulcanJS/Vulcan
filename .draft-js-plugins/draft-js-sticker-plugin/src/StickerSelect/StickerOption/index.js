import React, { Component } from 'react';

/**
 * Showcases a sticker one can then pick to add to the editor
 */
export default class StickerOption extends Component {

  onClick = () => {
    this.props.onClick(this.props.id);
  };

  render() {
    const { id, url } = this.props;
    const { theme = {} } = this.props;
    return (
      <button
        onClick={this.onClick}
        key={id}
        type="button"
        className={theme.selectSticker}
      >
        <img
          className={theme.selectStickerImage}
          src={url}
          role="presentation"
        />
      </button>
    );
  }
}
