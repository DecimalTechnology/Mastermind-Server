
import {Document, Types} from 'mongoose'
export interface IConnections extends Document{
    _id:any
    userId:any
    connections:any
    sentRequests:any
    receiveRequests:any
   
}