// import gql from 'graphql-tag';

// const fragments = {
  
//   list: {
//     name: 'postsListFragment',
//     fragment: gql` 
//       fragment postsListFragment on Post {
//         _id
//         title
//         url
//         slug
//         postedAt
//         sticky
//         status
//         user {
//           # ...avatarUserInfo
//           _id
//           displayName
//           emailHash
//           slug
//         }
//       }
//     `,
//   },

//   single: {
//     name: 'postsSingleFragment',
//     fragment: gql` 
//       fragment postsSingleFragment on Post {
//         _id
//         title
//         url
//         body
//         htmlBody
//         slug
//         thumbnailUrl
//         baseScore
//         postedAt
//         sticky
//         status
//         categories {
//           # ...minimumCategoryInfo
//           _id
//           name
//           slug
//         }
//         commentCount
//         commenters {
//           # ...avatarUserInfo
//           _id
//           displayName
//           emailHash
//           slug
//         }
//         upvoters {
//           _id
//         }
//         downvoters {
//           _id
//         }
//         upvotes # should be asked only for admins?
//         score # should be asked only for admins?
//         viewCount # should be asked only for admins?
//         clickCount # should be asked only for admins?
//         user {
//           # ...avatarUserInfo
//           _id
//           displayName
//           emailHash
//           slug
//         }
//       }
//     `,
//   },
// };

// export default fragments;