import React, { Component } from 'react';
// eslint-disable-next-line import/no-unresolved
import simpleExampleCode from '!!../../../loaders/prism-loader?language=javascript!./SimpleInlineToolbarEditor';
// eslint-disable-next-line import/no-unresolved
import simpleExampleEditorStylesCode from '!!../../../loaders/prism-loader?language=css!./SimpleInlineToolbarEditor/editorStyles.css';
// eslint-disable-next-line import/no-unresolved
import customExampleCode from '!!../../../loaders/prism-loader?language=javascript!./CustomInlineToolbarEditor';
// eslint-disable-next-line import/no-unresolved
import customExampleEditorStylesCode from '!!../../../loaders/prism-loader?language=css!./CustomInlineToolbarEditor/editorStyles.css';
// eslint-disable-next-line import/no-unresolved
import themedExampleCode from '!!../../../loaders/prism-loader?language=javascript!./ThemedInlineToolbarEditor';
// eslint-disable-next-line import/no-unresolved
import themedExampleEditorStylesCode from '!!../../../loaders/prism-loader?language=css!./ThemedInlineToolbarEditor/editorStyles.css';
// eslint-disable-next-line import/no-unresolved
import gettingStarted from '!!../../../loaders/prism-loader?language=javascript!./gettingStarted';
// eslint-disable-next-line import/no-unresolved
import webpackConfig from '!!../../../loaders/prism-loader?language=javascript!./webpackConfig';
// eslint-disable-next-line import/no-unresolved
import webpackImport from '!!../../../loaders/prism-loader?language=javascript!./webpackImport';
import Container from '../../shared/Container';
import AlternateContainer from '../../shared/AlternateContainer';
import Heading from '../../shared/Heading';
import styles from './styles.css';
import Code from '../../shared/Code';
import InlineCode from '../../shared/InlineCode';
import SimpleInlineToolbarEditor from './SimpleInlineToolbarEditor';
import CustomInlineToolbarEditor from './CustomInlineToolbarEditor';
import ThemedInlineToolbarEditor from './ThemedInlineToolbarEditor';
import SocialBar from '../../shared/SocialBar';
import NavBar from '../../shared/NavBar';
import Separator from '../../shared/Separator';
import ExternalLink from '../../shared/Link';

export default class App extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <Separator />
        <Container>
          <Heading level={2}>InlineToolbar</Heading>
        </Container>
        <AlternateContainer>
          <Heading level={2}>Getting Started</Heading>
          <Code code="npm install draft-js-plugins-editor@beta --save" />
          <Code code="npm install draft-js-inline-toolbar-plugin@beta --save" />
          <Code code={gettingStarted} name="gettingStarted.js" />
          <Heading level={3}>Importing the default styles</Heading>
          <p>
            The plugin ships with a default styling available at this location in the installed package:
            &nbsp;
            <InlineCode code={'node_modules/draft-js-inline-toolbar-plugin/lib/plugin.css'} />
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
            Please help, by submiting a Pull Request to the <ExternalLink href="https://github.com/draft-js-plugins/draft-js-plugins/blob/master/docs/client/components/pages/InlineToolbar/index.js">documentation</ExternalLink>.
          </p>
        </AlternateContainer>
        <Container>
          <Heading level={2}>Simple Inline Toolbar Example</Heading>
          <SimpleInlineToolbarEditor />
          <Code code={simpleExampleCode} name="SimpleInlineToolbarEditor.js" />
          <Code code={simpleExampleEditorStylesCode} name="editorStyles.css" />
        </Container>
        <Container>
          <Heading level={2}>Custom Inline Toolbar Example</Heading>
          <CustomInlineToolbarEditor />
          <Code code={customExampleCode} name="CustomInlineToolbarEditor.js" />
          <Code code={customExampleEditorStylesCode} name="editorStyles.css" />
        </Container>
        <Container>
          <Heading level={2}>Themed Inline Toolbar Example</Heading>
          <ThemedInlineToolbarEditor />
          <Code code={themedExampleCode} name="ThemedInlineToolbarEditor.js" />
          <Code code={themedExampleEditorStylesCode} name="editorStyles.css" />
        </Container>
        <SocialBar />
      </div>

    );
  }
}
