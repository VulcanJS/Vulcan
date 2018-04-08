import changePassword from './changePassword'
import createUser from './createUser'
import forgotPassword from './forgotPassword'
import hashPassword from './hashPassword'
import loginWithPassword from './loginWithPassword'
import logout from './logout'
import resendVerificationEmail from './resendVerificationEmail'
import resetPassword from './resetPassword'
import verifyEmail from './verifyEmail'
import loginWithFacebook from './oauth/loginWithFacebook'
import loginWithGoogle from './oauth/loginWithGoogle'
import loginWithLinkedIn from './oauth/loginWithLinkedIn'
import userId from './userId'
import {onTokenChange, getLoginToken, setTokenStore} from './store'

export {
  changePassword,
  createUser,
  forgotPassword,
  getLoginToken,
  hashPassword,
  loginWithPassword,
  logout,
  resendVerificationEmail,
  resetPassword,
  verifyEmail,
  loginWithFacebook,
  loginWithGoogle,
  loginWithLinkedIn,
  onTokenChange,
  setTokenStore,
  userId
}
