# Migrations

Doc to help updating downstream applications. Breaking changes and packages updates are listed here.

Please open an issue or a pull request if you feel this doc is incomplete.

## Updating Meteor

- Check that your version of `boilerplate-generator` is right. If not, overwrite it manually in `packages/_boilerplate/package.js`. This package is a hack to support SSR, so it's ok to manually change the version without actually updating
- Check that you don't have hard dependency on core packages, like `accounts-password@1.16.0`. They could conflict with Meteor core package version.
- Run `meteor update`. Note: when running the update on the Starter, remember to setup `METEOR_PACKAGES_DIRS=...` correctly, so it points to your local `devel` install of Vulcan.

## From 1.16 to 1.16.1

- `meteor update`
- `meteor npm i --save string-similarity @apollo/client`
- Migrate your code to Apollo client v3: https://www.apollographql.com/docs/react/migrating/apollo-client-3-migration/
- Migrate the names of base form controls in `vulcan:ui-material` if import them into your code. See `Vulcan/packages/vulcan-ui-material/history.md`.
 
## From 1.15 to 1.16

- `meteor npm i --save node-cache`
- Read Vulcan blog article related to 1.16
- Schemas without "_id" or "userId" won't have those fields in the default form fragment anymore (extremely edge case)

## From 1.14.1 to 1.15

- Update Meteor with `meteor update`
- /!\ Carefully update NPM packages versions based on the current package.json, otherwise install will fail
- `single2` hoc and hooks will return the whole `error` object, not just `error.graphQLErrors[0]`. This will help catching network errors too.
- Install `npm i --save body-parser-graphql`
- CORS are now disabled as a default in production. Use `apolloServer.corsWhitelist` to whitelist some domains, or `apolloServer.corsEnableAll` to allow all 
connections.


## From 1.13.5 to 1.14

- See migration article from [Vulcan Blog](https://blog.vulcanjs.org/)
- `serverTimezoneOffset` object is no longer injected in the head during SSR. Use `import { InjectData} from 'meteor/vulcan:lib; ...; await InjectData.getData("utcOffset");` instead. The value is the reverse from `getTimezoneOffset`, see [Moment doc](https://momentjscom.readthedocs.io/en/latest/moment/03-manipulating/09-utc-offset/)
- `validateModifier` takes `data` as the second param (`validateModifier(modifier, data, document)` instead of `validateModifier(modifier, document)`)

### Material UI
- Update to v4 `meteor npm i --save-exact @material-ui/core@4.5.1`
- `import MuiThemeProvider from @material-ui/core/styles/MuiThemeProvider"` becomes `import { MuiThemeProvider } from "@material-ui/core/styles"`
- More broadly follow https://material-ui.com/guides/migration-v3/ to update Material UI to v4
- Follow the composition doc to handle `forwardRef` warnings: https://material-ui.com/guides/composition/#caveat-with-refs

## From 1.13.3 to 1.13.5

- `npm install apollo-utilities` (to run tests)
- Replace `Users.getViewableFields` by `Users.getReadableProjection` 


## From 1.13.2 to 1.13.3

- Update React to a version over 16.8 (and under 17 which will bring breaking changes) to access hooks
- Update React Apollo and Apollo Client to access GraphQL hooks: `npm i --save-exact apollo-client@2.6.3; npm i --save react-apollo@3.0.0`
- `compose` is not exported by `react-apollo`, use `recompose` instead.
- More broadly see [`react-apollo` changelog](https://github.com/apollographql/react-apollo/blob/master/Changelog.md) for breaking changes
- `editMutation`, `newMutation` etc. are deprecated, use the new `updateFoo`, `createFoo` syntax. An error message is thrown where deprecated mutations are used to help debugging
- When using Vulcan data oriented hooks (`useMulti`, `useCreate`...), use the new `queryOptions` and `mutationOptions` option to pass options to the underlying `useQuery` and `useMutation` hooks.
Example call: `useMulti({collection: Foos, queryOptions: { errorPolicy: "all" } })`.
- No need to call `registerComponent` anymore to use Vulcan HOC. You can call them directly even if the underlying fragment is not yet registered.
- Watched Mutations has been removed because it didn't work anymore, in favour to better Apollo's `update` option for mutations.

