import { Document } from "mongoose";


export interface ILocal extends Document{
    name:string;
    nationId:any;
    regionId:any;
    isActive:boolean;
    createdBy:any;
    updatedAt:Date;
    createdAt:Date
}