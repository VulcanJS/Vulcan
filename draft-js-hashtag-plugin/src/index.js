import decorateComponentWithProps from 'decorate-component-with-props';
import Hashtag from './Hashtag';
import hashtagStrategy from './hashtagStrategy';
import styles from './styles.css';

const defaultTheme = {
  hashtag: styles.hashtag,
};

export default (config = {}) => {
  // Styles are overwritten instead of merged as merging causes a lot of confusion.
  //
  // Why? Because when merging a developer needs to know all of the underlying
  // styles which needs a deep dive into the code. Merging also makes it prone to
  // errors when upgrading as basically every styling change would become a major
  // breaking change. 1px of an increased padding can break a whole layout.
  const theme = config.theme ? config.theme : defaultTheme;
  return {
    decorators: [
      {
        strategy: hashtagStrategy,
        component: decorateComponentWithProps(Hashtag, { theme }),
      },
    ],
  };
};
