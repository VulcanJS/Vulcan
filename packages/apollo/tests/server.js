import { Meteor } from 'meteor/meteor'
import { assert } from 'meteor/practicalmeteor:chai'
import { getUser } from 'meteor/apollo'
import { Accounts } from 'meteor/accounts-base'

const USER_WITH_VALID_TOKEN = {
  username: 'valid',
  token: 'valid-token'
}
const USER_WITH_EXPIRED_TOKEN = {
  username: 'expired',
  token: 'expired-token'
}

Meteor.users.upsert(
  { username: USER_WITH_VALID_TOKEN.username },
  {
    username: USER_WITH_VALID_TOKEN.username,
    services: {
      resume: {
        loginTokens: [
          {
            when: new Date(),
            hashedToken: Accounts._hashLoginToken(USER_WITH_VALID_TOKEN.token)
          }
        ]
      }
    }
  }
)

// default expiration is 90 days
const NINETY_ONE_DAYS = 1000 * 60 * 60 * 24 * 91

Meteor.users.upsert(
  { username: USER_WITH_EXPIRED_TOKEN.username },
  {
    username: USER_WITH_EXPIRED_TOKEN.username,
    services: {
      resume: {
        loginTokens: [
          {
            when: new Date(Date.now() - NINETY_ONE_DAYS),
            hashedToken: Accounts._hashLoginToken(USER_WITH_EXPIRED_TOKEN.token)
          }
        ]
      }
    }
  }
)

// utility function for async operations
const handleDone = fn => async done => {
  try {
    await fn()
    done()
  } catch (e) {
    done(e)
  }
}

describe('getUser', () => {
  it(
    'returns the user',
    handleDone(async () => {
      const { token, username } = USER_WITH_VALID_TOKEN
      const user = await getUser(token)
      assert.equal(user.username, username)
    })
  )

  it(
    'does not return an unknown user',
    handleDone(async () => {
      const user = await getUser('invalid-token')
      assert.equal(user, undefined)
    })
  )

  it(
    'does not return an expired user',
    handleDone(async () => {
      const user = await getUser(USER_WITH_EXPIRED_TOKEN.token)
      assert.equal(user, undefined)
    })
  )
})
