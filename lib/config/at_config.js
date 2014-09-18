//Fields
AccountsTemplates.addField({
    _id: "username",
    type: "text",
    displayName: "username",
    required: true,
    minLength: 5,
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
AccountsTemplates.configureRoute("signIn", {
    path: "sign-in",
    template: "aTmpls",
});

AccountsTemplates.configureRoute("signUp", {
    path: "sign-up",
    template: "aTmpls",
});

AccountsTemplates.configureRoute("forgotPwd", {
    path: "forgot-password",
    template: "aTmpls",
});

AccountsTemplates.configureRoute("resetPwd", {
    path: "reset-password",
    template: "aTmpls",
});

//AccountsTemplates.configureRoute("changePwd");
//AccountsTemplates.configureRoute("enrollAccount");
//AccountsTemplates.configureRoute("verifyEmail");

// Options
AccountsTemplates.configure({
    enablePasswordChange: false,
    showForgotPasswordLink: true,
    confirmPassword: false,
/*
    overrideLoginErrors: true,
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