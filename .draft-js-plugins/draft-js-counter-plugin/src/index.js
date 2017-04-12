import decorateComponentWithProps from 'decorate-component-with-props';
import CharCounter from './CharCounter';
import WordCounter from './WordCounter';
import LineCounter from './LineCounter';
import CustomCounter from './CustomCounter';
import styles from './styles.css';

const defaultTheme = {
  counter: styles.counter,
  counterOverLimit: styles.counterOverLimit,
};

export default (config = {}) => {
  const store = {
    getEditorState: undefined,
    setEditorState: undefined,
  };
  // Styles are overwritten instead of merged as merging causes a lot of confusion.
  //
  // Why? Because when merging a developer needs to know all of the underlying
  // styles which needs a deep dive into the code. Merging also makes it prone to
  // errors when upgrading as basically every styling change would become a major
  // breaking change. 1px of an increased padding can break a whole layout.
  const theme = config.theme ? config.theme : defaultTheme;
  return {
    CharCounter: decorateComponentWithProps(CharCounter, { theme, store }),
    WordCounter: decorateComponentWithProps(WordCounter, { theme, store }),
    LineCounter: decorateComponentWithProps(LineCounter, { theme, store }),
    CustomCounter: decorateComponentWithProps(CustomCounter, { theme, store }),
    initialize: ({ getEditorState, setEditorState }) => {
      store.getEditorState = getEditorState;
      store.setEditorState = setEditorState;
    },
  };
};
