import { NotFoundError } from "../../../../../constants/customErrors";
import { ITycb } from "../../../../../interfaces/models/ITycb";
import { UserRepository } from "../../shared/repositories/userRepository";
import { TYCBRepository } from "./TYCBRepository";

export class TYCBServices {
    constructor(private tycbRepository: TYCBRepository,private userRepository:UserRepository) {}

    async createTycb(data:ITycb): Promise<ITycb> {
        const user = await this.userRepository.findById(data?.toUser);
        if(!user) throw new NotFoundError("The user you are trying to send the tycb is not found");
        return await this.tycbRepository.create(data)
    }

    async getAllTycb(userId:string):Promise<ITycb[]>{
        return await this.tycbRepository.getAllTycb(userId)
    }
    async getAllSentTycb(userId:string):Promise<ITycb[]>{
        return await this.tycbRepository.getAllSentTycb(userId)
    }
}
