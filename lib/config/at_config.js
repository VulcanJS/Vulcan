//////////////////////////////////
// AccountsTemplates configuration
//////////////////////////////////


var removeSpaces = function(value){
  return value.replace(" ", "");
};

//Fields
AccountsTemplates.addField({
    _id: 'username',
    type: 'text',
    displayName: 'username',
    required: true,
    minLength: 3,
    errStr: 'error.minChar',
    trim: true,
    lowercase: true,
    transform: removeSpaces
});

AccountsTemplates.removeField('email');
AccountsTemplates.addField({
    _id: 'email',
    type: 'email',
    required: true,
    re: /.+@(.+){2,}\.(.+){2,}/,
    errStr: 'error.accounts.Invalid email',
    trim: true,
    lowercase: true,
    transform: removeSpaces
});

AccountsTemplates.removeField('password');
AccountsTemplates.addField({
    _id: 'password',
    type: 'password',
    required: true,
    minLength: 8,
    errStr: 'error.minChar'
});

AccountsTemplates.addField({
    _id: 'username_and_email',
    type: 'text',
    required: true,
    displayName: 'usernameOrEmail',
    placeholder: 'usernameOrEmail',
    trim: true,
    lowercase: true,
    transform: removeSpaces
});


//Routes
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
//AccountsTemplates.configureRoute('changePwd');
//AccountsTemplates.configureRoute('enrollAccount');
//AccountsTemplates.configureRoute('verifyEmail');


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
});

// hack to get signOut route not considered among previous paths
if (Meteor.isClient) {
    Meteor.startup(function(){
        AccountsTemplates.knownRoutes.push('/sign-out');
    });
}