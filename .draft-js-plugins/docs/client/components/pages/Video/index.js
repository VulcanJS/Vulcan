import React, { Component } from 'react';

// eslint-disable-next-line import/no-unresolved
import simpleExampleCode from '!!../../../loaders/prism-loader?language=javascript!./SimpleVideoEditor';
// eslint-disable-next-line import/no-unresolved
import customExampleCode from '!!../../../loaders/prism-loader?language=javascript!./CustomVideoEditor';
// eslint-disable-next-line import/no-unresolved
import addVideoEditorExampleCode from '!!../../../loaders/prism-loader?language=javascript!./CustomAddVideoVideoEditor';
// eslint-disable-next-line import/no-unresolved
import gettingStarted from '!!../../../loaders/prism-loader?language=javascript!./gettingStarted';
// eslint-disable-next-line import/no-unresolved

import Container from '../../shared/Container';
import AlternateContainer from '../../shared/AlternateContainer';
import Heading from '../../shared/Heading';
import styles from './styles.css';
import Code from '../../shared/Code';
import SimpleVideoEditor from './SimpleVideoEditor';
import CustomVideoEditor from './CustomVideoEditor';
import CustomAddVideoVideoEditor from './CustomAddVideoVideoEditor';
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
          <Heading level={2} >Video</Heading>
        </Container>
        <AlternateContainer>
          <Heading level={2} >Getting Started</Heading>
          <Code code="npm install draft-js-plugins-editor@beta --save" />
          <Code code="npm install draft-js-video-plugin --save" />
          <Code code={gettingStarted} name="gettingStarted.js" />
        </AlternateContainer>
        <Container>
          <Heading level={2} >Configuration Parameters</Heading>
          <div className={styles.param} >
            <span className={styles.paramName} >theme</span>
            <span>Object of CSS classes with the following keys.</span>
            <div className={styles.subParams} >
              <div className={styles.subParam} ><span className={styles.subParamName} >link:</span> CSS class to be
                applied to link text
              </div>
            </div>
          </div>
          <div className={styles.param} >
            <span className={styles.paramName} >target</span>
            <span>String value for the target attribute. (Default value is _self)</span>
          </div>
          <div className={styles.param} >
            <span className={styles.paramName} >component</span>
            <span>If provided this component will be rendered instead of the default Anchor tag. It receives the following props: target, href & className</span>
          </div>
        </Container>
        <Container>
          <Heading level={2} >Simple Example</Heading>
          <SimpleVideoEditor />
          <Code code={simpleExampleCode} name="SimpleVideoEditor.js" />
        </Container>
        <Container>
          <Heading level={2} >Advanced Video Example</Heading>
          <CustomVideoEditor />
          <Code code={customExampleCode} name="CustomVideoEditor.js" />
        </Container>
        <Container>
          <Heading level={2} >Add Video Button Example</Heading>
          <CustomAddVideoVideoEditor />
          <Code code={addVideoEditorExampleCode} name="CustomAddVideoVideoEditor.js" />
        </Container>
        <SocialBar />
      </div>
    );
  }
}
