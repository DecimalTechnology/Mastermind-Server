import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IChat extends Document {
  isGroup: boolean;
  participants: mongoose.Types.ObjectId[];
  groupName?: string;
  groupImage?: string;
  admin?: mongoose.Types.ObjectId;
  lastMessage?: mongoose.Types.ObjectId;
  updatedAt?: Date;
  createdAt?: Date;
}

const chatSchema: Schema<IChat> = new Schema<IChat>(
  {
    isGroup: {
      type: Boolean,
      default: false,
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],

    groupName: {
      type: String,
      required: function (this: IChat) {
        return this.isGroup;
      },
    },

    groupImage: {
      type: String,
      default: 'https://default-group-image-url.png',
    },

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: function (this: IChat) {
        return this.isGroup;
      },
    },

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Chat: Model<IChat> = mongoose.model<IChat>('Chat', chatSchema);
export default Chat;
