import Posts from "meteor/nova:posts";

/*
Let's assign a color to each post (why? cause we want to, that's why).
We'll do that by adding a custom field to the Posts collection.
Note that this requires our custom package to depend on nova:posts and nova:users.
*/

Posts.addField(
  {
    fieldName: 'color',
    fieldSchema: {
      type: String,
      control: "select", // use a select form control
      optional: true, // this field is not required
      insertableBy: ['members'],
      editableBy: ['members'],
      viewableBy: ['members'],
      form: {
        options: function () { // options for the select form control
          return [
            {value: "white", label: "White"},
            {value: "yellow", label: "Yellow"},
            {value: "blue", label: "Blue"},
            {value: "red", label: "Red"},
            {value: "green", label: "Green"}
          ];
        }
      },
    }
  }
);

/*******************************************************************/
Users.addField([
  {
    fieldName: 'rating',
    fieldSchema: {
      type: Number,
      optional: false, // this field is required
      //insertableIf: canInsert,
      //editableIf: canEdit,
      defaultValue: 'ET1',
      publish: true // make that field public and send it to the client
    }
  },
  {
    fieldName: 'rank',
    fieldSchema: {
      type: String,
      label: 'Users Rank',
      optional: false, // this field is required
      defaultValue: 'none',
      //insertableIf: canInsert,
      //editableIf: canEdit,
      publish: true // make that field public and send it to the client
    }
  },
  {
    fieldName: 'awards',
    fieldSchema: {
      type: Object,
      label: 'User Awards',
      optional: false, // this field is required
      defaultValue: '0', //set default rating to 0
      //insertableIf: canInsert,
      //editableIf: canEdit,
      publish: true // make that field public and send it to the client
    }
  },
//----------Work Specific Schema----------//
  {
    fieldName: 'job',
    fieldSchema: {
      type: String,
      label: 'User Job',
      optional: true, // this field is required
      defaultValue: 'none',
      //insertableIf: canInsert,
      //editableIf: canEdit,
      publish: true // make that field public and send it to the client
    }
  },
  {
    fieldName: 'education',
    fieldSchema: {
      type: Object,
      label: 'User Education',
      optional: false, // this field is required
      defaultValue: 'none',
      //insertableIf: canInsert,
      //editableIf: canEdit,
      publish: true // make that field public and send it to the client
    }
  },
  {
    fieldName: 'prospectiveJob',
    fieldSchema: {
      type: String,
      label: 'Prospective Job',
      optional: false, // this field is required
      defaultValue: 'none',
      //insertableIf: canInsert,
      //editableIf: canEdit,
      publish: true // make that field public and send it to the client
    }
  },
  {
    fieldName: 'jobLocation',
    fieldSchema: {
      type: String,
      label: 'Job Location',
      optional: false, // this field is required
      defaultValue: 'none',
      //insertableIf: canInsert,
      //editableIf: canEdit,
      publish: true // make that field public and send it to the client
    }
  },
  {
    fieldName: 'certifications',
    fieldSchema: {
      type: Object,
      label: 'Certifications',
      optional: false, // this field is required
      defaultValue: 'none',
      //insertableIf: canInsert,
      //editableIf: canEdit,
      publish: true // make that field public and send it to the client
    }
  },
//----------Game Specific----------//
  {
    fieldName: 'xboxGamerTag',
    fieldSchema: {
      type: String,
      label: 'Xbox Gamer Tag',
      optional: true, // this field is required
      defaultValue: 'none',
      //insertableIf: canInsert,
      //editableIf: canEdit,
      publish: true // make that field public and send it to the client
    }
  },
  {
    fieldName: 'psGamerTag',
    fieldSchema: {
      type: String,
      label: 'Playstation Gamer Tag',
      optional: true, // this field is required
      defaultValue: 'none',
      //insertableIf: canInsert,
      //editableIf: canEdit,
      publish: true // make that field public and send it to the client
    }
  },
  {
    fieldName: 'originGamerTag',
    fieldSchema: {
      type: String,
      label: 'Origin Gamer Tag',
      optional: true, // this field is required
      defaultValue: 'none',
      //insertableIf: canInsert,
      //editableIf: canEdit,
      publish: true // make that field public and send it to the client
    }
  },
  {
    fieldName: 'uPlayGamerTag',
    fieldSchema: {
      type: String,
      label: 'uPlay Gamer Tag',
      optional: true, // this field is required
      defaultValue: 'none',
      //insertableIf: canInsert,
      //editableIf: canEdit,
      publish: true // make that field public and send it to the client
    }
  },
  {
    fieldName: 'bNetGamerTag',
    fieldSchema: {
      type: String,
      label: 'Battle.Net Gamer Tag',
      optional: true, // this field is required
      defaultValue: 'none',
      //insertableIf: canInsert,
      //editableIf: canEdit,
      publish: true // make that field public and send it to the client
    }
  }
]);
