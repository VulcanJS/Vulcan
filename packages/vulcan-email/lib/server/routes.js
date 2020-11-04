import { Picker } from 'meteor/meteorhacks:picker';
import { getSetting } from 'meteor/vulcan:lib';
import { VulcanEmail } from '../modules/index.js';
import pickBy from 'lodash/pickBy';

Meteor.startup(function() {
  Object.keys(VulcanEmail.emails).forEach(key => {
    const email = VulcanEmail.emails[key];

    // backwards-compatibility
    const path = email.testPath || email.path;

    if (path) {
      // template live preview routes
      Picker.route(path, async (params, req, res) => {
        let html;
        // if email has a custom way of generating test HTML, use it
        if (typeof email.getTestHTML !== 'undefined') {
          html = email.getTestHTML.bind(email)(params);
        } else {
          const locale = params.query.locale || getSetting('locale');
          delete params.query;

          // filter out ":foo" placeholder param segments
          const cleanedParams = pickBy(params, (value, key) => value && value.charAt(0) !== ':');

          // else get test object (sample post, comment, user, etc.)
          const testVariables =
            (typeof email.testVariables === 'function' ? email.testVariables(cleanedParams) : email.testVariables) || {};
          // delete params.query so we don't pass it to GraphQL query
          delete params.query;

          const variables = testVariables;

          const { data: emailTestData, subject, to, html: builtHtml } = await VulcanEmail.build({
            emailName: key,
            variables,
            locale,
          });

          // remove Strings object to avoid echoing it out
          delete emailTestData.__;

          html = `
          ${builtHtml}
          <h4 style="margin: 20px;"><code>Subject: ${subject}</code></h4>
          <h4 style="margin: 20px;"><code>To: ${to}</code></h4>
          <h5 style="margin: 20px;">Test Variables:</h5>
          <div style="border: 1px solid #999; padding: 10px 20px; margin: 20px;">
            <pre><code>${JSON.stringify(variables, null, 2)}</code></pre>
          </div>
          <h5 style="margin: 20px;">Data:</h5>
          <div style="border: 1px solid #999; padding: 10px 20px; margin: 20px; overflow-x: scroll">
            <pre><code>${JSON.stringify(emailTestData, null, 2)}</code></pre>
          </div>
        `;
        }

        // return html
        res.end(html);
      });
    }

    // raw template
    Picker.route('/email/template/:template', (params, req, res) => {
      res.end(VulcanEmail.templates[params.template]);
    });
  });
});
