import mongoose from "mongoose";
import { IAccountablity } from "../interfaces/models/IAccountablity";

const accountabilitySlipSchema = new mongoose.Schema<IAccountablity>(
    {
        place: { type: String, required: true },
        date: { type: Date, required: true },
        time: { type: String, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        members: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "users",
                },
            ],
            default: [],
        },
    },
    { timestamps: true }
);

const AccountablitySlip = mongoose.model<IAccountablity>("Accountability", accountabilitySlipSchema);

export default AccountablitySlip;
