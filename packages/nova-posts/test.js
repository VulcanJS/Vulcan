import { Tinytest } from "meteor/tinytest";
import Posts from 'meteor/nova:posts';

Tinytest.add('nova:posts - initialize', function (test) {
    test.isNotNull(Posts);
});