import { generateRandomPassword } from "./password/generateRandomPassword"
import { hashPassword } from "./password/password"

export const generateSamlePassword  = async()=>{
    const password =await  hashPassword("reevagadha@321")
    console.log(password);
}