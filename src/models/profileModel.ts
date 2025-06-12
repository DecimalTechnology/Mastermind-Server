import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    userId:{type:mongoose.Types.ObjectId,ref:'users'},
    company:{type:String,default:''},
    image:{type:String,default:''},
    about:{type:String,default:''},
    dob:{type:String,default:''},
    industries:{type:Array,default:[]},
    phoneNumbers:{type:Array,default:[]},
    email:{type:String,default:''},
    googleMapLocation:{type:String,default:''},
    website:{type:String,default:''},
    socialMediaLinks:{type:Object,default:{}},
    memberSince:{type:String,default:''}
  

},{timestamps:true})


const Profile = mongoose.model('Profile',profileSchema);
export default Profile;