import { Access } from 'payload/config'

export const authorOrAdmin: Access = ({ req: { user } }) => {
    if (user.collection === 'users') {
        return true
      }

    if (!user) { // not authenticated
    return false
    }

  return {
    senderID: {
      equals: user.id,
    }
  }
}