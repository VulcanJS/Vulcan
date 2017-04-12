import React, { Component } from 'react';

// eslint-disable-next-line import/no-unresolved
import simpleExampleCode from '!!../../../loaders/prism-loader?language=javascript!./SimpleHashtagEditor';
// eslint-disable-next-line import/no-unresolved
import simpleExampleEditorStylesCode from '!!../../../loaders/prism-loader?language=css!./SimpleHashtagEditor/editorStyles.css';
// eslint-disable-next-line import/no-unresolved
import customExampleCode from '!!../../../loaders/prism-loader?language=javascript!./CustomHashtagEditor';
// eslint-disable-next-line import/no-unresolved
import customExampleEditorStylesCode from '!!../../../loaders/prism-loader?language=css!./CustomHashtagEditor/editorStyles.css';
// eslint-disable-next-line import/no-unresolved
import customExampleHashtagStylesCode from '!!../../../loaders/prism-loader?language=css!./CustomHashtagEditor/hashtagStyles.css';
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
import SimpleHashtagEditor from './SimpleHashtagEditor';
import CustomHashtagEditor from './CustomHashtagEditor';
import SocialBar from '../../shared/SocialBar';
import NavBar from '../../shared/NavBar';
import Separator from '../../shared/Separator';
import ExternalLink from '../../shared/Link';

export default class App extends Component {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <div>
        <NavBar />
        <Separator />
        <Container>
          <Heading level={2}>Hashtag</Heading>
        </Container>
        <AlternateContainer>
          <Heading level={2}>Getting Started</Heading>
          <Code code="npm install draft-js-plugins-editor@beta --save" />
          <Code code="npm install draft-js-hashtag-plugin@beta --save" />
          <Code code={gettingStarted} name="gettingStarted.js" />
          <Heading level={3}>Importing the default styles</Heading>
          <p>
            The plugin ships with a default styling available at this location in the installed package:
            &nbsp;
            <InlineCode code={'node_modules/draft-js-hashtag-plugin/lib/plugin.css'} />
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
            Please help, by submiting a Pull Request to the <ExternalLink href="https://github.com/draft-js-plugins/draft-js-plugins/blob/master/docs/client/components/pages/Hashtag/index.js">documentation</ExternalLink>.
          </p>
        </AlternateContainer>
        <Container>
          <Heading level={2}>Configuration Parameters</Heading>
          <div className={styles.param}>
            <span className={styles.paramName}>theme</span>
            <span>Object of CSS classes with the following keys.</span>
            <div className={styles.subParams}>
              <div className={styles.subParam}><span className={styles.subParamName}>hashtag:</span> CSS class to be applied to hashtag text</div>
            </div>
          </div>
        </Container>
        <Container>
          <Heading level={2}>Simple Example</Heading>
          <SimpleHashtagEditor />
          <Code code={simpleExampleCode} name="SimpleHashtagEditor.js" />
          <Code code={simpleExampleEditorStylesCode} name="editorStyles.css" />
        </Container>
        <Container>
          <Heading level={2}>Themed Hashtag Example</Heading>
          <CustomHashtagEditor />
          <Code code={customExampleCode} name="CustomHashtagEditor.js" />
          <Code code={customExampleHashtagStylesCode} name="hashtagStyles.css" />
          <Code code={customExampleEditorStylesCode} name="editorStyles.css" />
        </Container>
        <SocialBar />
      </div>

    );
  }
}
