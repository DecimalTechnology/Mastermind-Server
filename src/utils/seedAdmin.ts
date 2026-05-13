import { connectDB } from "../config/connectDb";

import bcrypt from "bcrypt";
import { hashPassword } from "./v1/password/password";
import User from "../models/userModel";
import Profile from "../models/profileModel";
import mongoose from "mongoose";

const seedAdmin = async () => {
    try {
        await connectDB();

        const name = "Growth MM Admin";
        const nameWithoutSpace = name.replace(/\s/g, "");

        const role = "core_team_admin";
        const manage = { chapter: new mongoose.Types.ObjectId("6968d5bf08b51b448d3526e4") };

        const email = `${nameWithoutSpace.toLowerCase()}@gmail.com`;

        const password = await hashPassword("12345");
        const user = await User.findOne({ email });
        if (user) return;
        const newUserObj = {
            name,
            email,
            phonenumber: 1234567890,
            password: password,
            role,
            chapter: "6968d216e20bee42b412c0e0",
            manage,
            isVerified: true,
        };

        const newUser = await User.create(newUserObj);
        const profileObj = {
            userId: newUser?._id,
            company: "",
            image: "",
            about: "",
            dob: "",
            industries: [],
            phoneNumbers: [newUser?.phonenumber],
            email: newUser?.email,
            googleMapLocation: "",
            website: "",
            memberSince: "",
        };

        const newProfile = await Profile.create(profileObj);

        console.log(newProfile);
    } catch (error: any) {
        console.log(error?.message);
    }
};

export default seedAdmin;
