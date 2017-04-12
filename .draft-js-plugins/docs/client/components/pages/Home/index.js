/* eslint-disable react/no-unknown-property */
import React, { Component } from 'react';
import UnicornEditor from './UnicornEditor';
import Heading from '../../shared/Heading';
import Separator from '../../shared/Separator';
import styles from './styles.css';
import ContainerBox from '../../shared/ContainerBox';
import Container from '../../shared/Container';
import AlternateContainer from '../../shared/AlternateContainer';
import SocialBar from '../../shared/SocialBar';
import GithubButton from '../../shared/GithubButton';
import NavBar from '../../shared/NavBar';
import ExternalLink from '../../shared/Link';
import MailchimpForm from '../../shared/MailchimpForm';

export default class App extends Component {

  state = {
    logoClassName: styles.hiddenLogo,
  };

  componentDidMount() {
    this.setState({ // eslint-disable-line react/no-did-mount-set-state
      logoClassName: styles.logo,
    });
    this.animateLogo();
  }

  animateLogo = () => {
    // Only required in componentDidMount as it breaks server-side-rendering
    const animate = require('animateplus'); // eslint-disable-line global-require

    animate({
      el: this.drawnPath,
      'stroke-dashoffset': [570, 1140],
      duration: 800,
      easing: 'easeOutSine',
      delay: 600,
    });

    animate({
      el: this.penTop,
      'stroke-dashoffset': [85, 0],
      duration: 900,
      easing: 'linear',
      delay: 1100,
    });

    animate({
      el: this.penRing,
      'stroke-dashoffset': [48, 0],
      duration: 900,
      easing: 'linear',
      delay: 1100,
    });

    animate({
      el: this.penHandle,
      'stroke-dashoffset': [228, 456],
      duration: 900,
      easing: 'linear',
      delay: 1100,
    });

    animate({
      el: this.dot,
      rx: [0, 3.6743313],
      ry: [0, 1.73943662],
      duration: 600,
      easing: 'easeOutQuad',
      delay: 1500,
    });

    animate({
      el: this.githubWrapper,
      opacity: [0, 1],
      duration: 1600,
      easing: 'easeOutQuad',
      delay: 2500,
    });
  };

  render() {
    return (
      <div>
        <div className={styles.header}>
          <ContainerBox>
            <svg className={this.state.logoClassName} viewBox="0 0 263 209" version="1.1">
              <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="Pencil" transform="translate(177.000000, 1.000000)" stroke="#979797" strokeWidth="2" fill="#FFFFFF">
                  <path
                    d="M9.86222802,83.2346527 C19.7086177,60.3135066 19.0904437,60.4954622 28.5876706,39.951712 C38.4066597,18.711948 62.1639292,-4.34969769 69.2604522,0.785282207 C76.3569752,5.92026211 68.390785,32.8458652 59.3370307,46.9675386 C50.2832764,61.089212 26.4106229,88.7005045 26.4106229,88.7005045 C26.4106229,88.7005045 15.8709471,84.8808725 9.86222802,83.2346527 Z"
                    id="Path-2"
                    strokeDasharray="228"
                    strokeDashoffset="228"
                    ref={(element) => { this.penHandle = element; }}
                  />
                  <path
                    d="M27.0409545,85.9009649 C27.0409545,84.3313098 26.1525667,82.9025007 24.698475,81.8335735 C23.0842946,80.6469623 20.7729906,79.9038379 18.2059893,79.9038379 C13.3265727,79.9038379 9.37102405,82.5888431 9.37102405,85.9009649 C9.37102405,89.2130867 13.3265727,91.8980919 18.2059893,91.8980919 C23.0854058,91.8980919 27.0409545,89.2130867 27.0409545,85.9009649 Z" id="Oval-1" transform="translate(18.205989, 85.900965) rotate(14.000000) translate(-18.205989, -85.900965) "
                    strokeDasharray="48"
                    strokeDashoffset="48"
                    ref={(element) => { this.penRing = element; }}
                  />
                  <path
                    d="M0.014878413,113.951878 C1.78180994,108.545401 2.43334044,105.616394 2.43334044,95.9203125 C3.53217498,94.3115413 4.86453139,92.7130126 6.26188059,91.2345519 C9.7362174,87.5585412 12.0429116,84.7660539 13.7303754,84.2627016 C17.9673635,84.2627016 20.6406783,85.746119 22.9093963,86.9867691 C22.9093963,90.2466481 22.134279,93.848891 19.3059407,100.370564 C9.49146758,105.559173 5.55996694,109.67568 0.014878413,113.951878 Z"
                    id="Path-1"
                    strokeDasharray="85"
                    strokeDashoffset="85"
                    ref={(element) => { this.penTop = element; }}
                  />
                </g>
                <g id="Line" transform="translate(1.000000, 117.000000)" stroke="#979797">
                  <ellipse
                    id="Oval-1" fill="#979797" cx="174.040826" cy="1.73943662" rx="0" ry="0"
                    ref={(element) => { this.dot = element; }}
                  />
                  <path
                    d="M173.726977,1.74286972 C173.726977,1.74286972 81.2371686,10.7928991 76.8796413,26.5927817 C72.522114,42.3926643 296.495571,20.2825558 256.053049,46.3454959 C215.610526,72.408436 0.0593251408,90.9481221 0.0593251408,90.9481221"
                    id="Path-5"
                    strokeDasharray="570"
                    strokeDashoffset="570"
                    ref={(element) => { this.drawnPath = element; }}
                  />
                </g>
              </g>
            </svg>
            <div className={styles.logoText}>DraftJS Plugins</div>
            <p className={styles.tagline}>High quality plugins with great UX</p>
            <div className={styles.githubWrapper} ref={(element) => { this.githubWrapper = element; }}>
              <GithubButton user="draft-js-plugins" repo="draft-js-plugins" size="mega" />
            </div>
          </ContainerBox>
        </div>
        <NavBar />
        <Separator />
        <AlternateContainer>
          <p className={styles.whatText}>
            Slack-like emoji autocompletion, Facebook-like stickers & mentions, and many more features out of the box to enhance your web application.
          </p>
          <Heading level={2}>Wait, but why?</Heading>
          <p className={styles.whyText}>
            Facebook&apos;s rich-text editor framework
            <ExternalLink href="https://facebook.github.io/draft-js/">
              &nbsp;DraftJS&nbsp;
            </ExternalLink>
            built on top of
            <ExternalLink href="https://facebook.github.io/react/">
              &nbsp;React&nbsp;
            </ExternalLink>
            allows you to create powerful editors. We&apos;re building a plugin architecture on top of it that aims to provide you with plug & play extensions. It comes with a set of plugins with great UX serving mobile & desktop as well as screen-readers. You can combine them in any way you want or build your own.
          </p>
        </AlternateContainer>
        <Container>
          <div className={styles.demoWrapper}>
            <Heading level={2}>Gif Demo</Heading>
            <br /><br />
            <img src="/images/demo.gif" role="presentation" width="175" height="250" className={styles.demo} />
          </div>
        </Container>
        <AlternateContainer>
          <Heading level={2}>Help spread the word …</Heading>
          <SocialBar />
        </AlternateContainer>
        <Container>
          <Heading level={2}>Try it yourself</Heading>
          <UnicornEditor />
          <Heading level={3}>Plugins used in this Editor</Heading>
          <div className={styles.flexCenteredDisplay}>
            <ul>
              <li>Stickers</li>
              <li>Hashtags</li>
              <li>Linkify (automatically turns links into a-tags)</li>
              <li>Mentions</li>
              <li>Emojis</li>
            </ul>
          </div>
          <Heading level={3}>Why a UnicornEditor?</Heading>
          <p className={styles.center}>
            Because Unicorns are cooler than cats 😜
          </p>
        </Container>
        <AlternateContainer>
          <Heading level={2}>Team</Heading>
          <div className={styles.teamSection}>
            <div className={styles.teamMember}>
              <ExternalLink className={styles.teamTwitterLink} href="https://twitter.com/jyopur">
                <img className={styles.teamImage} src="https://avatars0.githubusercontent.com/u/2182307?v=3&s=200" role="presentation" />
                <div>Jyoti Puri</div>
              </ExternalLink>
            </div>
            <div className={styles.teamMember}>
              <ExternalLink className={styles.teamTwitterLink} href="https://twitter.com/juliandoesstuff">
                <img className={styles.teamImage} src="https://avatars2.githubusercontent.com/u/1188186?v=3&s=200" role="presentation" />
                <div>Julian Krispel-Samsel</div>
              </ExternalLink>
            </div>
            <div className={styles.teamMember}>
              <ExternalLink className={styles.teamTwitterLink} href="https://twitter.com/mrussell247">
                <img className={styles.teamImage} src="https://pbs.twimg.com/profile_images/517863945/mattsailing_200x200.jpg" role="presentation" />
                <div>Matthew Russell</div>
              </ExternalLink>
            </div>
            <div className={styles.teamMember}>
              <ExternalLink className={styles.teamTwitterLink} href="https://twitter.com/psbrandt">
                <img className={styles.teamImage} src="https://pbs.twimg.com/profile_images/688487813025640448/E6O6I011_200x200.png" role="presentation" />
                <div>Pascal Brandt</div>
              </ExternalLink>
            </div>
            <div className={styles.teamMember}>
              <ExternalLink className={styles.teamTwitterLink} href="https://twitter.com/nikgraf">
                <img className={styles.teamImage} src="https://avatars0.githubusercontent.com/u/223045?v=3&s=200" role="presentation" />
                <div>Nik Graf</div>
              </ExternalLink>
            </div>
            <div className={styles.teamMember}>
              <ExternalLink className={styles.teamTwitterLink} href="https://twitter.com/mxstbr">
                <img className={styles.teamImage} src="https://pbs.twimg.com/profile_images/763033229993574400/6frGyDyA_200x200.jpg" role="presentation" />
                <div>Max Stoiber</div>
              </ExternalLink>
            </div>
            <div className={styles.teamMember}>
              <ExternalLink className={styles.teamTwitterLink} href="https://twitter.com/adrianmcli">
                <img className={styles.teamImage} src="https://pbs.twimg.com/profile_images/778069320194719744/R8SJ2ZX7_200x200.jpg" role="presentation" />
                <div>Adrian Li</div>
              </ExternalLink>
            </div>
          </div>
          <p className={styles.specialThanks}>
            Special thanks to all the people from Stripe for their invaluable feedback and funding Nik&apos;s efforts during the&nbsp;
            <ExternalLink href="https://stripe.com/blog/open-source-retreat-2016-grantees">
              Stripe Open Source Retreat
            </ExternalLink>.
          </p>
        </AlternateContainer>
        <Container>
          <Heading level={2}>Discussion and Support</Heading>
          <p className={styles.center}>
            Join the <b>#draft-js-plugins</b> channel after signing up to the <ExternalLink href="https://draftjs.herokuapp.com">DraftJS Slack organization</ExternalLink>
          &nbsp;or check out or collection of frequently asked questions here:&nbsp;
            <ExternalLink href="https://github.com/draft-js-plugins/draft-js-plugins/blob/master/FAQ.md">
              FAQ
            </ExternalLink>.
          </p>
          <Heading level={2}>Stay Informed</Heading>
          <p className={styles.center}>
            by signing up to our newsletter
          </p>
          <MailchimpForm />
        </Container>
      </div>
    );
  }
}
