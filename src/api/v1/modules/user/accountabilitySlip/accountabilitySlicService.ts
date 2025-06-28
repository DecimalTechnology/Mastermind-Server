import { NotFoundError } from "../../../../../constants/customErrors";
import { IAccountablity } from "../../../../../interfaces/models/IAccountablity";
import { AccountablityRepository } from "./accountablitySilpRepository";

export class AccountabilitySliService{
    constructor(private accountabilityRepository:AccountablityRepository){

    }

    async createAccountablity(data:IAccountablity):Promise<IAccountablity>{
        return await this.accountabilityRepository.create(data);
    }
    async getAllAccountablity(userId:string):Promise<IAccountablity[]>{
        return await this.accountabilityRepository.findAllAccountability(userId);
    }
    async getSlipById(slipId:string):Promise<IAccountablity|null>{
        const slip =  await this.accountabilityRepository.findById(slipId);
        if(!slip) throw new NotFoundError("The slip is not found")
        return slip;
    }
}