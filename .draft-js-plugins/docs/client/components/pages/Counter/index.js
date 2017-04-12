import React, { Component } from 'react';

import gettingStarted from '!!../../../loaders/prism-loader?language=javascript!./gettingStarted'; // eslint-disable-line import/no-unresolved
import simpleExampleCode from '!!../../../loaders/prism-loader?language=javascript!./SimpleCounterEditor'; // eslint-disable-line import/no-unresolved
import simpleEditorStylesCode from '!!../../../loaders/prism-loader?language=css!./SimpleCounterEditor/editorStyles.css'; // eslint-disable-line import/no-unresolved
import customExampleCode from '!!../../../loaders/prism-loader?language=javascript!./CustomCounterEditor'; // eslint-disable-line import/no-unresolved
import customExampleEditorStylesCode from '!!../../../loaders/prism-loader?language=css!./CustomCounterEditor/editorStyles.css'; // eslint-disable-line import/no-unresolved
import customExampleCounterStylesCode from '!!../../../loaders/prism-loader?language=css!./CustomCounterEditor/counterStyles.css'; // eslint-disable-line import/no-unresolved
import webpackConfig from '!!../../../loaders/prism-loader?language=javascript!./webpackConfig'; // eslint-disable-line import/no-unresolved
import webpackImport from '!!../../../loaders/prism-loader?language=javascript!./webpackImport'; // eslint-disable-line import/no-unresolved

import styles from './styles.css';
import Container from '../../shared/Container';
import AlternateContainer from '../../shared/AlternateContainer';
import Heading from '../../shared/Heading';
import SimpleCounterEditor from './SimpleCounterEditor';
import CustomCounterEditor from './CustomCounterEditor';
import NavBar from '../../shared/NavBar';
import Separator from '../../shared/Separator';
import SocialBar from '../../shared/SocialBar';
import Code from '../../shared/Code';
import ExternalLink from '../../shared/Link';
import InlineCode from '../../shared/InlineCode';

export default class App extends Component {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <div>
        <NavBar />
        <Separator />
        <Container>
          <Heading level={2}>Counter</Heading>
          <p>
            A simple counter plugin for all your counting needs. You can even set a limit to change the color past a certain threshold.
          </p>
          <Heading level={3}>Usage</Heading>
          <p>
            To use, simply import and instantiate the counter plugin, and then use one of the available counter components in your JSX. Out of the box, the following counters are included:
          </p>
          <ul>
            <li>Character Counter</li>
            <li>Word Counter</li>
            <li>Line Counter</li>
            <li>Custom Counter</li>
          </ul>
          <p>The Custom Counter allows you to bring your own counting function. This will be a function that takes plain text (as a string) from the editor as input and returns a numerical value.</p>
        </Container>
        <AlternateContainer>
          <Heading level={2}>Getting Started</Heading>
          <Code code="npm install draft-js-plugins-editor@beta --save" />
          <Code code="npm install draft-js-counter-plugin@beta --save" />
          <Code code={gettingStarted} name="gettingStarted.js" />
          <Heading level={3}>Importing the default styles</Heading>
          <p>
            The plugin ships with a default styling available at this location in the installed package:
            &nbsp;
            <InlineCode code={'node_modules/draft-js-counter-plugin/lib/plugin.css'} />
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
            Please help, by submiting a Pull Request to the <ExternalLink href="https://github.com/draft-js-plugins/draft-js-plugins/blob/master/docs/client/components/pages/Counter/index.js">documention</ExternalLink>.
          </p>
        </AlternateContainer>
        <Container>
          <Heading level={2}>Configuration Parameters</Heading>
          <div className={styles.param}>
            <div className={styles.paramName}>theme</div>
            <div>Javascript object of CSS classes with the following keys.
              <div className={styles.subParams}>
                <div className={styles.subParam}><span className={styles.subParamName}>counter:</span> CSS class to be applied to the number displayed when not over the specified limit</div>
                <div className={styles.subParam}><span className={styles.subParamName}>counterOverLimit:</span> CSS class to be applied to the number displayed when over the specified limit</div>
              </div>
            </div>
          </div>
          <Heading level={2}>Component Properties</Heading>
          <div className={styles.param}>
            <div className={styles.paramName}>limit</div>
            <div>A limit to indicate to the user that a threshold has passed.</div>
          </div>
          <div className={styles.param}>
            <div className={styles.paramName}>countFunction</div>
            <div>A custom counting function for the Custom Counter. The function will receive plain text from the editor (as a string) as input and should return a numerical value.</div>
          </div>
        </Container>
        <Container>
          <Heading level={2}>Simple Example</Heading>
          <SimpleCounterEditor />
          <Code code={simpleExampleCode} name="SimpleCounterEditor.js" />
          <Code code={simpleEditorStylesCode} name="editorStyles.css" />
        </Container>
        <Container>
          <Heading level={2}>Themed Example</Heading>
          <CustomCounterEditor />
          <Code code={customExampleCode} name="CustomCounterEditor.js" />
          <Code code={customExampleCounterStylesCode} name="counterStyles.css" />
          <Code code={customExampleEditorStylesCode} name="editorStyles.css" />
        </Container>
        <SocialBar />
      </div>
    );
  }
}
