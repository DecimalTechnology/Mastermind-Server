import mongoose, { Types } from "mongoose";
import { IConnections } from "../interfaces/models/IConnection";


const connectionSchema = new mongoose.Schema<IConnections>(
    {
      userId: { type: Types.ObjectId, ref: "users"},
      connections: [{ type: Types.ObjectId, ref: "users", default: [] }],
      sentRequests: [{ type: Types.ObjectId, ref: "users", default: [] }],
      receiveRequests: [{ type: Types.ObjectId, ref: "users", default: [] }],
    },
    { timestamps: true }
  );


const Connection =  mongoose.model<IConnections>('Connection',connectionSchema);
export default Connection;