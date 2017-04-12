import React from 'react';
import { fromJS } from 'immutable';
import unionClassNames from 'union-class-names';

const MentionLink = ({ mention, children, className }) =>
  <a
    href={mention.get('link')}
    className={className}
    spellCheck={false}
  >
    {children}
  </a>;

const MentionText = ({ children, className }) =>
  <span
    className={className}
    spellCheck={false}
  >
    {children}
  </span>;

const Mention = (props) => {
  const {
    entityKey,
    theme = {},
    mentionComponent,
    children,
    decoratedText,
    className,
    contentState,
  } = props;

  const combinedClassName = unionClassNames(theme.mention, className);
  const mention = fromJS(contentState.getEntity(entityKey).getData().mention);

  const Component = (
    mentionComponent || (mention.has('link') ? MentionLink : MentionText)
  );

  return (
    <Component
      entityKey={entityKey}
      mention={mention}
      theme={theme}
      className={combinedClassName}
      decoratedText={decoratedText}
    >
      {children}
    </Component>
  );
};

export default Mention;
