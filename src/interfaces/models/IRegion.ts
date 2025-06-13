import { Document } from "mongoose";


export interface IRegion extends Document{
    _id:any;
    createdBy:any;
    name:string
    updatedAt:Date;
    createdAt:Date;
    nationId:any;
    isActive:boolean
}