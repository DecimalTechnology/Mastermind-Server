import mongoose from "mongoose";



const meetingSchema = new mongoose.Schema({


   createdBy:{type:mongoose.Schema.Types.ObjectId,ref:"User"},


 

    dates: [{ 
        type: Date 
    }],

    location: { 
        type: String, 
        required: true 
    },

    meetingType: { 
        type: String, 
        required: true,
        enum: ['Chapter', 'Local', 'Region', 'Nation', 'Global']
    },

    referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'meetingType'   
    },
    customFields:[]
},{timestamps:true});

export default mongoose.model("Meeting", meetingSchema);
