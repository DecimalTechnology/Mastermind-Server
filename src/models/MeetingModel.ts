import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
    {
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

        dates: [
            {
                type: Date,
            },
        ],

        location: {
            type: String,
            required: true,
        },

        meetingType: {
            type: String,
            required: true,
            enum: ["Chapter", "Local", "Region", "Nation", "Global"],
        },

        referenceId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "meetingType",
        },
        classification:{type:String},
        customFields: [],
        status:{type:String,enum:["Upcoming","Ended","Closed"],default:"Upcoming"},
        participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
    },
    { timestamps: true },
);

export default mongoose.model("Meeting", meetingSchema);
