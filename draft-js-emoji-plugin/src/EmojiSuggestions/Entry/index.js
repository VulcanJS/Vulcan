import React, {
  // PropTypes,
  Component,
} from 'react';
import emojione from 'emojione';

export default class Entry extends Component {

  constructor(props) {
    super(props);
    this.mouseDown = false;
  }

  componentDidUpdate() {
    this.mouseDown = false;
  }

  onMouseUp = () => {
    if (this.mouseDown) {
      this.mouseDown = false;
      this.props.onEmojiSelect(this.props.emoji);
    }
  };

  onMouseDown = (event) => {
    // Note: important to avoid a content edit change
    event.preventDefault();

    this.mouseDown = true;
  };

  onMouseEnter = () => {
    this.props.onEmojiFocus(this.props.index);
  };

  render() {
    const { theme = {}, imagePath, imageType, cacheBustParam } = this.props;
    const className = this.props.isFocused ? theme.emojiSuggestionsEntryFocused : theme.emojiSuggestionsEntry;
    // short name to image url code steal from emojione source code
    const shortNameForImage = emojione.emojioneList[this.props.emoji].unicode[emojione.emojioneList[this.props.emoji].unicode.length - 1];
    const fullImagePath = `${imagePath}${shortNameForImage}.${imageType}${cacheBustParam}`;
    return (
      <div
        className={className}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseEnter={this.onMouseEnter}
        role="option"
      >
        <img
          src={fullImagePath}
          className={theme.emojiSuggestionsEntryIcon}
          role="presentation"
        />
        <span className={theme.emojiSuggestionsEntryText}>
          {this.props.emoji}
        </span>
      </div>
    );
  }
}
