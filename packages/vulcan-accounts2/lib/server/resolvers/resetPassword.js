import callMethod from '../callMethod'

export default async function (root, {token, newPassword}, context) {
  return callMethod(context, 'resetPassword', token, newPassword)
}
