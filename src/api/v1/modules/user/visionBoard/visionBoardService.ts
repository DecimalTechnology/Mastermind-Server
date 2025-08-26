import { BadRequestError, ConflictError, NotFoundError } from "../../../../../constants/customErrors";
import { VisionBoardRepository } from "./visionBoardRepository";

export class VisionboardService {
    constructor(private visionboardRepository: VisionBoardRepository) {}

    async createVisionBoard(userId: string, data: any): Promise<any> {
        const year = new Date().getFullYear();
        const visionBoard = await this.visionboardRepository.findByUserId(userId, year);
        if (!visionBoard) {
            const newVisionBoard = { year, userId, goals: [data] };
            return await this.visionboardRepository.create(newVisionBoard);
        } else {
            const index = visionBoard.goals.findIndex((i: any) => i.goal.toLowerCase() == data.goal.toLowerCase());
            if (index > -1) {
                throw new ConflictError("The goal is already in the visionboard");
            }
            if (visionBoard.goals.length == visionBoard.goalLimit) {
                throw new BadRequestError("Goal limit exceeded");
            }
            visionBoard.goals.push(data);
            return await visionBoard.save();
        }
    }

    async deleteGoal(userId: string, year: number, goalId: string): Promise<any> {
        const visionBoard = await this.visionboardRepository.findByUserId(userId, year);
        if (!visionBoard) {
            throw new NotFoundError("Visionboard not found");
        }

        if (visionBoard.goals.length == 0) {
            throw new BadRequestError("Nothing to delete visionboard is empty");
        }

        const index = visionBoard.goals.findIndex((i: any) =>i?._id.toString()==goalId);

        if (index > -1) {
            visionBoard.goals.splice(index, 1);
            return await visionBoard.save();
        } else {
            throw new NotFoundError("Goal is not found in the visionboard");
        }
    }
    async updateGoal(userId: string, year: number, goalId: string, goalData: any): Promise<any> {
        console.log(goalData);
        const visionBoard = await this.visionboardRepository.findByUserId(userId, year);
        if (!visionBoard) {
            throw new NotFoundError("Vision board not found ");
        }
        const index = visionBoard.goals.findIndex((i: any) => i?._id.toString() == goalId);
        if (index > -1) {
            visionBoard.goals[index] = {
                ...visionBoard.goals[index]._doc,
                ...goalData,
            };
            return await visionBoard.save();
        } else {
            throw new NotFoundError("No goal found with this goal Id");
        }
    }

    async getVisionBoard(userId:string,year:number):Promise<any>{
       const visionBoard =  await this.visionboardRepository.findByUserId(userId,year);
       if(!visionBoard) throw new NotFoundError("Visionboard not found");
       return visionBoard;
    }
}
