import React, { Component } from 'react';

// eslint-disable-next-line import/no-unresolved
import simpleExampleCode from '!!../../../loaders/prism-loader?language=javascript!./SimpleMentionEditor';
// eslint-disable-next-line import/no-unresolved
import simpleExampleMentionsCode from '!!../../../loaders/prism-loader?language=javascript!./SimpleMentionEditor/mentions.js';
// eslint-disable-next-line import/no-unresolved
import simpleExampleEditorStylesCode from '!!../../../loaders/prism-loader?language=css!./SimpleMentionEditor/editorStyles.css';
// eslint-disable-next-line import/no-unresolved
import customExampleCode from '!!../../../loaders/prism-loader?language=javascript!./CustomMentionEditor';
// eslint-disable-next-line import/no-unresolved
import customExampleMentionsCode from '!!../../../loaders/prism-loader?language=javascript!./CustomMentionEditor/mentions.js';
// eslint-disable-next-line import/no-unresolved
import customExampleEditorStylesCode from '!!../../../loaders/prism-loader?language=css!./CustomMentionEditor/editorStyles.css';
// eslint-disable-next-line import/no-unresolved
import customExampleMentionsStylesCode from '!!../../../loaders/prism-loader?language=css!./CustomMentionEditor/mentionsStyles.css';
// eslint-disable-next-line import/no-unresolved
import remoteExampleCode from '!!../../../loaders/prism-loader?language=javascript!./RemoteMentionEditor';
// eslint-disable-next-line import/no-unresolved
import remoteExampleEditorStylesCode from '!!../../../loaders/prism-loader?language=css!./RemoteMentionEditor/editorStyles.css';
// eslint-disable-next-line import/no-unresolved
import customComponentExampleCode from '!!../../../loaders/prism-loader?language=javascript!./CustomComponentMentionEditor';
// eslint-disable-next-line import/no-unresolved
import customComponentExampleStylesCode from '!!../../../loaders/prism-loader?language=css!./CustomComponentMentionEditor/editorStyles.css';
// eslint-disable-next-line import/no-unresolved
import webpackConfig from '!!../../../loaders/prism-loader?language=javascript!./webpackConfig';
// eslint-disable-next-line import/no-unresolved
import webpackImport from '!!../../../loaders/prism-loader?language=javascript!./webpackImport';

import Container from '../../shared/Container';
import AlternateContainer from '../../shared/AlternateContainer';
import Heading from '../../shared/Heading';
import styles from './styles.css';
import Code from '../../shared/Code';
import SimpleMentionEditor from './SimpleMentionEditor';
import CustomMentionEditor from './CustomMentionEditor';
import RemoteMentionEditor from './RemoteMentionEditor';
import CustomComponentMentionEditor from './CustomComponentMentionEditor';
import SocialBar from '../../shared/SocialBar';
import NavBar from '../../shared/NavBar';
import Separator from '../../shared/Separator';
import ExternalLink from '../../shared/Link';
import InlineCode from '../../shared/InlineCode';

export default class App extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <Separator />
        <Container>
          <Heading level={2}>Mention</Heading>
          <p>
            Mentions for everyone! This plugin allows the user to choose an entry from a list. After selection an entry the search text will be replace with the selected entity. The list of suggestions mentions needs to contain at least a name to display. If desired a link and/or an avatar image can be provided.
          </p>
          <Heading level={3}>Escape Behaviour</Heading>
          <p>
            While the suggestion popover is open, the user can close it by pressing ESC.
            This will be stored for as long as the the selection stays inside
            the word that triggered the search. After the selection left this word once the escape behaviour will be reset.
            The suggestions will appear again once the user selects the word that
            that triggered the selection.
          </p>
        </Container>
        <AlternateContainer>
          <Heading level={2}>Getting Started</Heading>
          <Code code="npm install draft-js-plugins-editor@beta --save" />
          <Code code="npm install draft-js-mention-plugin@beta --save" />
          <Code code="Please checkout the 'Simple Example' further down the page." />
          <Heading level={3}>Importing the default styles</Heading>
          <p>
            The plugin ships with a default styling available at this location in the installed package:
            &nbsp;
            <InlineCode code={'node_modules/draft-js-mention-plugin/lib/plugin.css'} />
          </p>
          <Heading level={4}>Webpack Usage</Heading>
          <ul className={styles.list}>
            <li className={styles.listEntry}>
              1. Install Webpack loaders:
              &nbsp;
              <InlineCode code={'npm i style-loader css-loader --save-dev'} />
            </li>
            <li className={styles.listEntry}>
              2. Add the below section to Webpack config (if your config already has a loaders array, simply add the below loader object to your existing list.
              <Code code={webpackConfig} className={styles.guideCodeBlock} />
            </li>
            <li className={styles.listEntry}>
              3. Add the below import line to your component to tell Webpack to inject the style to your component.
              <Code code={webpackImport} className={styles.guideCodeBlock} />
            </li>
            <li className={styles.listEntry}>
              4. Restart Webpack.
            </li>
          </ul>
          <Heading level={4}>Browserify Usage</Heading>
          <p>
            Please help, by submiting a Pull Request to the <ExternalLink href="https://github.com/draft-js-plugins/draft-js-plugins/blob/master/docs/client/components/pages/Mention/index.js">documentation</ExternalLink>.
          </p>
        </AlternateContainer>
        <Container>
          <Heading level={2}>Configuration Parameters</Heading>
          <div className={styles.param}>
            <span className={styles.paramName}>theme</span>
            <span>Object of CSS classes with the following keys.</span>
            <div className={styles.subParams}>
              <div className={styles.subParam}>
                <span className={styles.subParamName}>mention:</span>
                CSS class for mention text.
              </div>
              <div className={styles.subParam}>
                <span className={styles.subParamName}>mentionSuggestions:</span>
                CSS class for suggestions component.
              </div>
              <div className={styles.subParam}>
                <span className={styles.subParamName}>mentionSuggestionsEntry:</span>
                CSS class for an entry in the suggestions component.
              </div>
              <div className={styles.subParam}>
                <span className={styles.subParamName}>mentionSuggestionsEntryFocused:</span>
                CSS class for the focused entry in the suggestions component.
              </div>
              <div className={styles.subParam}>
                <span className={styles.subParamName}>mentionSuggestionsEntryText:</span>
                CSS class for an entry’s text in the suggestions component.
              </div>
              <div className={styles.subParam}>
                <span className={styles.subParamName}>mentionSuggestionsEntryAvatar:</span>
                CSS class for an entry’s avatar image in the suggestions component.
              </div>
            </div>
          </div>
          <div className={styles.param}>
            <span className={styles.paramName}>positionSuggestions</span>
            <span>The function can be used to manipulate the position of the popover containing the suggestions. It receives one object as arguments containing the visible rectangle surrounding the decorated search string including the @. In addition the object contains prevProps, prevState, state & props. An object should be returned which can contain all sorts of styles. The defined properties will be applied as inline-styles.</span>
          </div>
          <div className={styles.param}>
            <span className={styles.paramName}>entityMutability</span>
            <span>Can be one of: &quot;IMMUTABLE&quot;, &quot;SEGMENTED&quot; or &quot;MUTABLE&quot;. Read in detail about it
              <ExternalLink
                href="https://facebook.github.io/draft-js/docs/advanced-topics-entities.html#mutability"
              >
                &nbsp;here
              </ExternalLink>
            </span>
          </div>
          <div className={styles.param}>
            <span className={styles.paramName}>mentionPrefix</span>
            <span>By default it is an empty String. For Twitter or Slack like mention behaviour you can provide an `@`</span>
          </div>
          <div className={styles.param}>
            <span className={styles.paramName}>mentionTrigger</span>
            <span>Allows you to provide a custom character to change when the search is triggered. By default it is set to `@`. By default typing `@` will trigger the search for mentions. Note: the implementation does not support a multi-character mentionTrigger.</span>
          </div>
          <div className={styles.param}>
            <span className={styles.paramName}>mentionRegExp</span>
            <span>Allows you to overwrite the regular expression for initiating the dropdown. By default this supports any alphanumeric character as well as Chinese, Japanese & Korean characters. We are happy to accept pull requests to extend the default mentionRegExp as well.</span>
          </div>
          <div className={styles.param}>
            <span className={styles.paramName}>mentionComponent</span>
            <span>If provided the passed component is used to render a Mention. It receives the following props: entityKey, mention, className & decoratedText</span>
          </div>
          <Heading level={3}>MentionSuggestions</Heading>
          <div>
            The MentionSuggestions component is part of the plugin and should placed somewhere in the
            JSX after the Editor. It takes the following props:
            <div className={styles.param}>
              <span className={styles.paramName}>onSearchChange</span>
              <span>A callback which is triggered whenever the search term changes. The first argument is an object which constains the search term in the property value.</span>
            </div>
            <div className={styles.param}>
              <span className={styles.paramName}>suggestions</span>
              <span>The list of suggestions to be shown.</span>
            </div>
            <div className={styles.param}>
              <span className={styles.paramName}>onOpen</span>
              <span>A callback which is triggered whenever the suggestions popover opens.</span>
            </div>
            <div className={styles.param}>
              <span className={styles.paramName}>onClose</span>
              <span>A callback which is triggered whenever the suggestions popover closes.</span>
            </div>
            <div className={styles.param}>
              <span className={styles.paramName}>entryComponent</span>
              <span>Component to be used as the template for each of the suggestions entry.</span>
            </div>
            <div className={styles.param}>
              <span className={styles.paramName}>onAddMention</span>
              <span>A callback which is triggered whenever the mention is about to be added. The first argument of this callback will contain the mention entry.</span>
            </div>
            <div className={styles.param}>
              <span className={styles.paramName}>popoverComponent</span>
              <span>Component to be used as the template for the popover (the parent of entryComponent).  Defaults to a div.</span>
            </div>
            <div className={styles.param}>
              <span>Additional properties are passed to the <InlineCode code="popoverComponent" /></span>
            </div>
          </div>
          <Heading level={3}>Additional Exports</Heading>
          <div>
            In addition to the plugin the module exports `defaultSuggestionsFilter`. As first argument it takes the search term as a String. The second argument is the Immutable list of mentions. The function returns the filter list based on substring matches.
            <Code code="import { defaultSuggestionsFilter } from 'draft-js-mention-plugin';" />
          </div>
        </Container>
        <Container>
          <Heading level={2}>Simple Example</Heading>
          <SimpleMentionEditor />
          <Code code={simpleExampleCode} name="SimpleMentionEditor.js" />
          <Code code={simpleExampleMentionsCode} name="mentions.js" />
          <Code code={simpleExampleEditorStylesCode} name="editorStyles.css" />
        </Container>
        <Container>
          <Heading level={2}>Custom Themed Mention Example</Heading>
          <CustomMentionEditor />
          <Code code={customExampleCode} name="CustomMentionEditor.js" />
          <Code code={customExampleMentionsStylesCode} name="mentionsStyles.js" />
          <Code code={customExampleMentionsCode} name="mentions.js" />
          <Code code={customExampleEditorStylesCode} name="editorStyles.css" />
        </Container>
        <Container>
          <Heading level={2}>Remote Data Mention Example</Heading>
          <RemoteMentionEditor />
          <Code code={remoteExampleCode} name="RemoteMentionEditor.js" />
          <Code code={remoteExampleEditorStylesCode} name="editorStyles.css" />
        </Container>
        <Container>
          <Heading level={2}>Custom Mention Component Example</Heading>
          <CustomComponentMentionEditor />
          <Code code={customComponentExampleCode} name="CustomComponentMentionEditor.js" />
          <Code code={customComponentExampleStylesCode} name="editorStyles.css" />
        </Container>
        <SocialBar />
      </div>
    );
  }
}
