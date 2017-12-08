import { Picker } from 'meteor/meteorhacks:picker';
import { runQuery } from 'meteor/vulcan:lib';
import VulcanEmail from '../namespace.js';

Meteor.startup(function () {

  _.forEach(VulcanEmail.emails, (email, key) => {

    // template live preview routes
    Picker.route(email.path, async (params, req, res) => {

      let html;
      // if email has a custom way of generating test HTML, use it
      if (typeof email.getTestHTML !== "undefined") {

        html = email.getTestHTML.bind(email)(params);

      } else {

        // else get test object (sample post, comment, user, etc.)
        const testVariables = (typeof email.testVariables === 'function' ? email.testVariables() : email.testVariables) || {};
        // merge test variables with params from URL
        const variables = {...testVariables, ...params};

        const result = email.query ? await runQuery(email.query, variables) : {data: {}};

        // if email has a data() function, merge it with results of query
        const emailTestData = email.data ? {...result.data, ...email.data(variables)} : result.data;
        const subject = typeof email.subject === 'function' ? email.subject(emailTestData) : email.subject;

        const template = VulcanEmail.getTemplate(email.template);
        const htmlContent = template(emailTestData)

        // then apply email template to properties, and wrap it with buildTemplate
        html = VulcanEmail.buildTemplate(htmlContent, emailTestData);

        html += `
          <h4 style="margin: 20px;"><code>Subject: ${subject}</code></h4>
          <div style="border: 1px solid #999; padding: 10px 20px; margin: 20px;">
            <pre><code>${JSON.stringify(emailTestData, null, 2)}</code></pre>
          </div>
        `
      }

      // return html
      res.end(html);

    });

    // raw template
    Picker.route("/email/template/:template", (params, req, res) => {
      res.end(VulcanEmail.templates[params.template]);
    });

  });

});
