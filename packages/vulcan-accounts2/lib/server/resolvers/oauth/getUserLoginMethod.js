import {Accounts} from 'meteor/accounts-base'

export default function (email) {
  if (!email) return 'unknown'
  const {services} = email.indexOf('@') !== -1 ? Accounts.findUserByEmail(email) : Accounts.findUserByUsername(email)
  const list = []
  for (const key in services) {
    if (key === 'email') continue
    if (key === 'resume') continue
    if (key === 'password' && !services.password.bcrypt) {
      list.push('no-password')
    } else {
      list.push(key)
    }
  }
  const allowedServices = [...Accounts.oauth.serviceNames(), 'password']
  return list.filter(service => allowedServices.indexOf(service) !== -1).join(', ')
}
