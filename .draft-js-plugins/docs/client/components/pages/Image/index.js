import React, { Component } from 'react';

// eslint-disable-next-line import/no-unresolved
import simpleExampleCode from '!!../../../loaders/prism-loader?language=javascript!./SimpleImageEditor';
// eslint-disable-next-line import/no-unresolved
import simpleExampleEditorStylesCode from '!!../../../loaders/prism-loader?language=css!./SimpleImageEditor/editorStyles.css';
// eslint-disable-next-line import/no-unresolved
import customExampleCode from '!!../../../loaders/prism-loader?language=javascript!./CustomImageEditor';
// eslint-disable-next-line import/no-unresolved
import customExampleEditorStylesCode from '!!../../../loaders/prism-loader?language=css!./CustomImageEditor/editorStyles.css';
// eslint-disable-next-line import/no-unresolved
import addImageExampleCode from '!!../../../loaders/prism-loader?language=javascript!./AddImageEditor';
// eslint-disable-next-line import/no-unresolved
import addImageExampleEditorStylesCode from '!!../../../loaders/prism-loader?language=css!./AddImageEditor/editorStyles.css';
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
import SimpleImageEditor from './SimpleImageEditor';
import CustomImageEditor from './CustomImageEditor';
import AddImageEditor from './AddImageEditor';
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
          <Heading level={2}>Image</Heading>
        </Container>
        <AlternateContainer>
          <Heading level={2}>Getting Started</Heading>
          <Code code="npm install draft-js-plugins-editor@beta --save" />
          <Code code="npm install draft-js-image-plugin@beta --save" />
          <Code code={gettingStarted} name="gettingStarted.js" />
          <Heading level={3}>Importing the default styles</Heading>
          <p>
            The plugin ships with a default styling available at this location in the installed package:
            &nbsp;
            <InlineCode code={'node_modules/draft-js-image-plugin/lib/plugin.css'} />
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
            Please help, by submiting a Pull Request to the <ExternalLink href="https://github.com/draft-js-plugins/draft-js-plugins/blob/master/docs/client/components/pages/Image/index.js">documentation</ExternalLink>.
          </p>
        </AlternateContainer>
        <Container>
          <Heading level={2}>Configuration Parameters</Heading>
          <div className={styles.param}>
            <span className={styles.paramName}>theme</span>
            <span>Object of CSS classes with the following keys.</span>
            <div className={styles.subParams}>
              <div className={styles.subParam}>
                <span className={styles.subParamName}>image:</span> CSS class for the image.
              </div>
              <div className={styles.subParam}>
                <span className={styles.subParamName}>addImage:</span> CSS class.
              </div>
              <div className={styles.subParam}>
                <span className={styles.subParamName}>addImagePopover:</span> CSS class.
              </div>
              <div className={styles.subParam}>
                <span className={styles.subParamName}>addImageClosedPopover:</span> CSS class.
              </div>
              <div className={styles.subParam}>
                <span className={styles.subParamName}>addImageBottomGradient:</span> CSS class.
              </div>
              <div className={styles.subParam}>
                <span className={styles.subParamName}>addImageButton:</span> CSS class.
              </div>
              <div className={styles.subParam}>
                <span className={styles.subParamName}>addImagePressedButton:</span> CSS class.
              </div>
              <div className={styles.subParam}>
                <span className={styles.subParamName}>addImageInput:</span> CSS class.
              </div>
              <div className={styles.subParam}>
                <span className={styles.subParamName}>addImageConfirmButton:</span> CSS class.
              </div>
            </div>
          </div>
          <div className={styles.paramBig}>
            <span className={styles.paramName}>imageComponent</span>
            <span>Pass in a custom image component to be rendered.</span>
          </div>
          <div className={styles.paramBig}>
            <span className={styles.paramName}>addImageButtonContent</span>
            <span>Content of button which opens add image popup. (Default content is 📷)</span>
          </div>
        </Container>
        <Container>
          <Heading level={2}>Simple Example</Heading>
          <SimpleImageEditor />
          <Code code={simpleExampleCode} name="SimpleImageEditor.js" />
          <Code code={simpleExampleEditorStylesCode} name="editorStyles.css" />
        </Container>
        <Container>
          <Heading level={2}>Alignment + Resize + Focus + Drag&apos;n&apos;Drop + Drag&apos;n&apos;Drop Upload Example</Heading>
          <CustomImageEditor />
          <Code code={customExampleCode} name="AddImageEditor.js" />
          <Code code={customExampleEditorStylesCode} name="editorStyles.css" />
        </Container>
        <Container>
          <Heading level={2}>Add Image Button Example</Heading>
          <AddImageEditor />
          <Code code={addImageExampleCode} name="AddImageEditor.js" />
          <Code code={addImageExampleEditorStylesCode} name="editorStyles.css" />
        </Container>
        <SocialBar />
      </div>
    );
  }
}
