import React, { Component } from 'react';

// eslint-disable-next-line import/no-unresolved
import simpleExampleCode from '!!../../../loaders/prism-loader?language=javascript!./SimpleStickerEditor';
// eslint-disable-next-line import/no-unresolved
import simpleExampleStickersCode from '!!../../../loaders/prism-loader?language=javascript!./SimpleStickerEditor/stickers.js';
// eslint-disable-next-line import/no-unresolved
import simpleExampleEditorStylesCode from '!!../../../loaders/prism-loader?language=css!./SimpleStickerEditor/editorStyles.css';
// eslint-disable-next-line import/no-unresolved
import customExampleCode from '!!../../../loaders/prism-loader?language=javascript!./CustomStickerEditor';
// eslint-disable-next-line import/no-unresolved
import customExampleStickersCode from '!!../../../loaders/prism-loader?language=javascript!./CustomStickerEditor/stickers.js';
// eslint-disable-next-line import/no-unresolved
import customExampleEditorStylesCode from '!!../../../loaders/prism-loader?language=css!./CustomStickerEditor/editorStyles.css';
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
import SimpleStickerEditor from './SimpleStickerEditor';
import CustomStickerEditor from './CustomStickerEditor';
import ExternalLink from '../../shared/Link';
import InlineCode from '../../shared/InlineCode';
import SocialBar from '../../shared/SocialBar';
import NavBar from '../../shared/NavBar';
import Separator from '../../shared/Separator';

export default class App extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <Separator />
        <Container>
          <Heading level={2}>Sticker</Heading>
        </Container>
        <AlternateContainer>
          <Heading level={2}>Getting Started</Heading>
          <Code code="npm install draft-js-plugins-editor@beta --save" />
          <Code code="npm install draft-js-sticker-plugin@beta --save" />
          <Code code={gettingStarted} name="gettingStarted.js" />
          <Heading level={3}>Importing the default styles</Heading>
          <p>
            The plugin ships with a default styling available at this location in the installed package:
            &nbsp;
            <InlineCode code={'node_modules/draft-js-sticker-plugin/lib/plugin.css'} />
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
            Please help, by submiting a Pull Request to the <ExternalLink href="https://github.com/draft-js-plugins/draft-js-plugins/blob/master/docs/client/components/pages/Sticker/index.js">documentation</ExternalLink>.
          </p>
        </AlternateContainer>
        <Container>
          <Heading level={2}>Configuration Parameters</Heading>
          <div className={styles.param}>
            <span className={styles.paramName}>theme</span>
            <span>Object of CSS classes with the following keys.</span>
            <div className={styles.subParams}>
              <div className={styles.subParam}><span className={styles.subParamName}>sticker:</span> CSS class for sticker.</div>
              <div className={styles.subParam}><span className={styles.subParamName}>stickerImage:</span> CSS class for sticker image tag.</div>
              <div className={styles.subParam}><span className={styles.subParamName}>stickerRemoveButton:</span> CSS class for sticker remove button.</div>
              <div className={styles.subParam}><span className={styles.subParamName}>select:</span> CSS class for sticker select.</div>
              <div className={styles.subParam}><span className={styles.subParamName}>selectPopover:</span> CSS class for sticker select popup.</div>
              <div className={styles.subParam}><span className={styles.subParamName}>selectClosedPopover:</span> CSS class for sticker select close button.</div>
              <div className={styles.subParam}><span className={styles.subParamName}>selectBottomGradient:</span> CSS class for sticker select bottom gradient.</div>
              <div className={styles.subParam}><span className={styles.subParamName}>selectButton:</span> CSS class for button to open sticker select.</div>
              <div className={styles.subParam}><span className={styles.subParamName}>selectPressedButton:</span> CSS class for pressed state of button to open sticker select.</div>
              <div className={styles.subParam}><span className={styles.subParamName}>selectStickerList:</span> CSS class for sticker select list.</div>
              <div className={styles.subParam}><span className={styles.subParamName}>selectSticker:</span> CSS class for sticker select.</div>
              <div className={styles.subParam}><span className={styles.subParamName}>selectStickerImage:</span> CSS class for sticker select image.</div>
            </div>
          </div>
          <div className={styles.param}>
            <span className={styles.paramName}>stickers</span>
            <span>Immutable.js List of stickers.</span>
          </div>
          <div className={styles.paramBig}>
            <span className={styles.paramName}>selectButtonContent</span>
            <span>Content of button which opens select sticker drop-down. (Default content is ☺)</span>
          </div>
          <div className={styles.paramBig}>
            <span className={styles.paramName}>attachRemoveButton</span>
            <span>Flag to attach or detach a remove button to stickers. (Default value is true)</span>
          </div>
        </Container>
        <Container>
          <Heading level={2}>Simple Example</Heading>
          <SimpleStickerEditor />
          <Code code={simpleExampleCode} name="SimpleStickerEditor.js" />
          <Code code={simpleExampleStickersCode} name="stickers.js" />
          <Code code={simpleExampleEditorStylesCode} name="editorStyles.css" />
        </Container>
        <Container>
          <Heading level={2}>Themed Sticker Example</Heading>
          <CustomStickerEditor />
          <Code code={customExampleCode} name="CustomStickerEditor.js" />
          <Code code={customExampleStickersCode} name="stickers.js" />
          <Code code={customExampleEditorStylesCode} name="editorStyles.css" />
        </Container>
        <SocialBar />
      </div>
    );
  }
}
