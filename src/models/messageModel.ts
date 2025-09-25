import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
    {
        chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
        senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },

        content: { type: String },

        media: {
            type: {
                type: String,
                enum: ["image", "video", "audio", "document"],
                required: false,
            },
            url: { type: String },
        },

        status: {
            type: String,
            enum: ["sending", "sent", "delivered", "read", "failed"],
            default: "sending",
        },

        timestamp: { type: Date, default: Date.now },
        editedAt: { type: Date },

        deletedFor: [{ type: Schema.Types.ObjectId, ref: "User" }],
        replyTo: { type: Schema.Types.ObjectId, ref: "Message" },
        forwarded: { type: Boolean, default: false },

      

        readBy: [
            {
                userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
                timestamp: { type: Date, default: Date.now },
            },
        ],
    },
    {
        timestamps: true, 
    }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
