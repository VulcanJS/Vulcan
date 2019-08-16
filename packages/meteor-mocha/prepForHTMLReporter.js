export default function prepForHTMLReporter() {
  // Add the CSS from CDN
  const link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', 'https://cdn.rawgit.com/mochajs/mocha/2.2.5/mocha.css');
  document.head.appendChild(link);

  // Add the div#mocha in which test results HTML will be placed
  const div = document.createElement('div');
  div.setAttribute('id', 'mocha');
  document.body.appendChild(div);
}
