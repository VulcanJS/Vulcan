import callMethod from '../callMethod'

export default async function (root, {token}, context) {
  return callMethod(context, 'verifyEmail', token)
}
