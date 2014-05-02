// Settings = new Meteor.Collection('settings');

Settings = new Meteor.Collection("settings", {
    schema: new SimpleSchema({
        title: {
            type: String,
            label: "Title",
        },
        tagline: {
            type: String,
            label: "Tagline"
        },
        copies: {
            type: Number,
            label: "Number of copies",
        },
        requireViewInvite: {
            type: Boolean,
            label: "Require invite to view",
        },
        requirePostInvite: {
            type: Boolean,
            label: "Require invite to post",
        },
        requirePostsApproval: {
            type: Boolean,
            label: "Posts must be approved by admin",
        },
        emailNotifications: {
            type: Boolean,
            label: "Enable email notifications",
        },
        nestedComments: {
            type: Boolean,
            label: "Enable nested comments",
        },
        redistributeKarma: {
            type: Boolean,
            label: "Enable redistributed karma",
        },
        defaultEmail: {
            type: String,
        },       
        scoreUpdateInterval: {
            type: Number,
        }, 
        postInterval: {
            type: Number,
        },
        commentInterval: {
            type: Number,
        },
        maxPostsPerDay: {
            type: Number,
        },
        startInvitesCount: {
            type: Number,
            defaultValue: 3
        },
        postsPerPage: {
            type: Number,
            defaultValue: 10
        },
        logoUrl: {
            type: String
        },
        logoHeight: {
            type: Number
        },
        logoWidth: {
            type: Number
        },
        language: {
            type: String,
            defaultValue: 'en'
        },
        backgroundColor: {
            type: String
        },
        secondaryColor: {
            type: String
        },
        buttonColor: {
            type: String
        },
        headerColor: {
            type: String
        },
        googleAnalyticsId: {
            type: String
        },
        mixpanelId: {
            type: String
        },
        clickyId: {
            type: String
        },
        embedlyId: {
            type: String
        },
        mailChimpAPIKey: {
            type: String
        },
        mailChimpListId: {
            type: String
        },
        footerCode: {
            type: String
        },
        extraCode: {
            type: String
        },
        notes: {
            type: String
        },                                                                                                                                                                                 
    })
});

Settings.allow({
  insert: isAdminById
, update: isAdminById
, remove: isAdminById
});

