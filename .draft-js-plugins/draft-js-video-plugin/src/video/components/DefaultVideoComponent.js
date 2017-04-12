import React, { PropTypes } from 'react';
import utils from '../utils';
import styles from './DefaultVideoComponent.css';

const YOUTUBE_PREFIX = 'https://www.youtube.com/embed/';
const VIMEO_PREFIX = 'https://player.vimeo.com/video/';
const iframeStyle = {
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: '0',
  left: '0',
};

const getSrc = ({ src }) => {
  const {
    isYoutube,
    getYoutubeSrc,
    isVimeo,
    getVimeoSrc,
  } = utils;
  if (isYoutube(src)) {
    const { srcID } = getYoutubeSrc(src);
    return `${YOUTUBE_PREFIX}${srcID}`;
  }
  if (isVimeo(src)) {
    const { srcID } = getVimeoSrc(src);
    return `${VIMEO_PREFIX}${srcID}`;
  }
  return undefined;
};

const DefaultVideoCompoent = (props) => {
  const { blockProps, style } = props;
  const src = getSrc(blockProps);
  if (src) {
    return (
      <div style={style} >
        <div className={styles.iframeContainer} >
          <iframe
            style={iframeStyle}
            src={src}
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (<div className={styles.invalidVideoSrc} >invalid video source</div>);
};

DefaultVideoCompoent.propTypes = {
  blockProps: PropTypes.object,
};
export default DefaultVideoCompoent;
