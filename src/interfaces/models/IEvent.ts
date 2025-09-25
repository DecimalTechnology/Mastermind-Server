import { Document } from "mongoose";
import { EventLevel } from "../../models/eventModel";

export interface IEvent extends Document {
    _id:any
  name: string;
  description: string;
  date: Date;
  time: string;
  endDate:any;
  place: string;
  image?: string;
  location?: string;
  attendees: string[]    
  eventType: EventLevel;             
  chapterId?: any      
  regionId?: any       
  nationId?: any      
  createdAt?: Date;              
  updatedAt?: Date;  
  status:string       
  duration:any      ;
  localId:any
  audienceType: string;
  customFields:any;
  createdBy:any
  rsvp:any
}