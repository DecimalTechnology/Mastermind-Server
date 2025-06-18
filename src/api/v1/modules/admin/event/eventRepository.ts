import mongoose from "mongoose";
import User from "../../../../../models/userModel";
import { BaseRepository } from "../../shared/repositories/baseRepository";
import Event from "../../../../../models/eventModel";
import { IEvent } from "../../../../../interfaces/models/IEvent";

export class EventRepository extends BaseRepository<IEvent>{

    constructor(){
        super(Event)
    }
    async findAllUsersByLevel(level:string,levelId:string,search:string): Promise<any> {

        if(level=='chapter'){
        return await User.aggregate([{$match:{chapter:new mongoose.Types.ObjectId(levelId)}},{$match:{name:{$regex:search,$options:'i'}}}]);
        }

        if(level=='region'){

        }

        if(level=='local'){

        }

        if(level=='nation'){
            
        }
        if(level=='global'){

        }
        console.log(level,levelId,search)
        return ''
    } 

    async getAllEvents():Promise<IEvent[]>{
        return await Event.find()
    }
}