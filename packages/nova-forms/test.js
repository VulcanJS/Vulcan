import { Tinytest } from "meteor/tinytest";
import FormWrapper from 'meteor/nova:forms';

Tinytest.add('nova:forms - initialize', function (test) {
    // because of compose()
    test.equal('GraphQL', FormWrapper.name);
});