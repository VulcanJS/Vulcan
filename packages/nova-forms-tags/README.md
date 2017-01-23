# Usage

1. Add `nova:forms-tags` to your `.meteor/packages` file.
2. Add `nova:forms-tags` to your custom package's dependencies in `package.js`. 
3. Add the [react-tag-input](https://www.npmjs.com/package/react-tag-input) NPM package with `npm install react-tag-input --save`.
4. In your code, `import Tags from 'meteor/nova:forms-tags'` and then set `control: Tags` on a custom field.