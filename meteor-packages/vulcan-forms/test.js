import { Tinytest } from "meteor/tinytest";
import FormWrapper from 'meteor/vulcan:forms';

Tinytest.add('vulcan:forms - initialize', function (test) {
    // because of compose()
    test.equal('GraphQL', FormWrapper.name);
});