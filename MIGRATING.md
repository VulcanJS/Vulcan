Doc to help updating downstream applications. Breaking changes and packages updates are listed here.

Please open an issue or a pull request if you feel this doc is incomplete.

## From 1.13.2 to 1.13.3

- Update React to a version over 16.8 (and under 17 which will bring breaking changes) to access hooks
- Update React Apollo and Apollo Client to access GraphQL hooks: `npm i --save-exact apollo-client@2.6.3; npm i --save react-apollo@3.0.0`
- `editMutation`, `newMutation` etc. are deprecated, use the new `updateFoo`, `createFoo` syntax. An error message is thrown where deprecated mutations are used to help debugging
- When using Vulcan data oriented hooks (`useMulti`, `useCreate`...), use the new `queryOptions` and `mutationOptions` option to pass options to the underlying `useQuery` and `useMutation` hooks.
Example call: `useMulti({collection: Foos, queryOptions: { errorPolicy: "all" } })`.
- No need to call `registerComponent` anymore to use Vulcan HOC. You can call them directly even if the underlying fragment is not yet registered.
- Watched Mutations has been removed because it didn't work anymore, in favour to better Apollo's `update` option for mutations.

