//////////////////////////////////
// AccountsTemplates configuration
//////////////////////////////////


//Fields
AccountsTemplates.addField({
    _id: "username",
    type: "text",
    displayName: "username",
    required: true,
    minLength: 3,
    errStr: 'error.minChar'
});

AccountsTemplates.removeField('email');
AccountsTemplates.addField({
    _id: 'email',
    type: 'email',
    required: true,
    re: /.+@(.+){2,}\.(.+){2,}/,
    errStr: 'error.accounts.Invalid email',
    trim: true,
    lowercase: true
});

AccountsTemplates.removeField('password');
AccountsTemplates.addField({
    _id: 'password',
    type: 'password',
    required: true,
    minLength: 8,
    errStr: 'error.minChar'
});

/*
 AccountsTemplates.addField({
 _id: "username_and_email",
 type: "text",
 displayName: "Name or Email",
 placeholder: "name or email",
 });
 */


//Routes
AccountsTemplates.configureRoute("signIn");
AccountsTemplates.configureRoute("signUp");
AccountsTemplates.configureRoute("forgotPwd");
AccountsTemplates.configureRoute("resetPwd");
//AccountsTemplates.configureRoute("changePwd");
//AccountsTemplates.configureRoute("enrollAccount");
//AccountsTemplates.configureRoute("verifyEmail");


// Options
AccountsTemplates.configure({
    enablePasswordChange: false,
    showForgotPasswordLink: true,
    confirmPassword: false,
    overrideLoginErrors: true,

    negativeFeedback: false,
    positiveFeedback: false,
    negativeValidation: true,
    positiveValidation: true
    /*
     sendVerificationEmail: true,
     continuousValidation: false,
     showLabels: true,
     forbidClientAccountCreation: false,
     formValidationFeedback: true,
     homeRoutePath: "/",
     showAddRemoveServices: false,
     showPlaceholders: true,
     */
});


// Initialization
Meteor.startup(function(){
    AccountsTemplates.init();
});