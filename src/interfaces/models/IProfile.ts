import { Document } from "mongoose";
export interface IProfile extends Document {
    company: string;
    image: string;
    about: string;
    dob?: any;
    userId:string
    industries?:any
    phoneNumbers: any;
    email: any;
    googleMapLocation?: string;
    website?: string;
    socialMediaLinks: any;
    memberSince?: string;
}
