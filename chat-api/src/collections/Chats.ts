import { CollectionConfig } from 'payload/types'

const Chats: CollectionConfig = {
  slug: 'chats',
  fields: [
    {
      name: 'authorID',
      type: 'text',
      required: true,
      defaultValue: ({ user }) => user.id,
    },
    {
        name : 'receiverID',
        type: 'text',
        required : true,
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
  ],
}

export default Chats
