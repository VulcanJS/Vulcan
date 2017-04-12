import { Map } from 'immutable';
import decorateComponentWithProps from 'decorate-component-with-props';
import addSticker from './modifiers/addSticker';
import removeSticker from './modifiers/removeSticker';
import cleanupEmptyStickers from './modifiers/cleanupEmptyStickers';
import blockRendererFn from './blockRendererFn';
import Sticker from './Sticker';
import StickerSelect from './StickerSelect';
import stickerStyles from './stickerStyles.css';
import selectStyles from './selectStyles.css';
import selectStickerStyles from './selectStickerStyles.css';

const defaultTheme = {
  sticker: stickerStyles.sticker,
  stickerImage: stickerStyles.stickerImage,
  stickerRemoveButton: stickerStyles.stickerRemoveButton,

  select: selectStyles.select,
  selectPopover: selectStyles.selectPopover,
  selectClosedPopover: selectStyles.selectClosedPopover,
  selectBottomGradient: selectStyles.selectBottomGradient,
  selectButton: selectStyles.selectButton,
  selectPressedButton: selectStyles.selectPressedButton,
  selectStickerList: selectStyles.selectStickerList,

  selectSticker: selectStickerStyles.selectSticker,
  selectStickerImage: selectStickerStyles.selectStickerImage,
};

export default (config = {}) => {
  // Styles are overwritten instead of merged as merging causes a lot of confusion.
  //
  // Why? Because when merging a developer needs to know all of the underlying
  // styles which needs a deep dive into the code. Merging also makes it prone to
  // errors when upgrading as basically every styling change would become a major
  // breaking change. 1px of an increased padding can break a whole layout.
  const theme = config.theme ? config.theme : defaultTheme;
  const stickers = config.stickers;
  const selectButtonContent = config.selectButtonContent ? config.selectButtonContent : '☺';

  // default to true if not explicitly set to false
  const attachRemoveButton = config.attachRemoveButton !== false;
  const stickerSelectProps = {
    selectButtonContent,
    stickers,
    theme,
  };
  const stickerProps = {
    attachRemoveButton,
    stickers,
    theme,
  };
  const blockRendererConfig = {
    ...config,
    Sticker: decorateComponentWithProps(Sticker, stickerProps),
  };
  return {
    blockRendererFn: blockRendererFn(blockRendererConfig),
    onChange: cleanupEmptyStickers,
    add: addSticker,
    remove: removeSticker,
    blockRenderMap: Map({ sticker: { element: 'div' } }),
    StickerSelect: decorateComponentWithProps(StickerSelect, stickerSelectProps),
  };
};
