import { ConflictError, NotFoundError } from "../../../../../constants/customErrors";
import { ITips } from "../../../../../models/tipsModel";
import { TipsRepository } from "./tipsRepository";

export class TipsService {
    constructor(private tipsRepository: TipsRepository) {}

    async getTodayTip(): Promise<ITips[]> {
        return await this.tipsRepository.findTodaysTip();
    }

    async getTipsById(id: string): Promise<ITips | null> {
        return await this.tipsRepository.findById(id);
    }

    async likeTips(userId: string, tipId: string): Promise<ITips | null> {
        console.log(tipId)
        const tips = await this.tipsRepository.findById(tipId);

        if (!tips) throw new NotFoundError("Tips not found");
        const index = tips.likes.findIndex((like: string) => like.toString() == userId.toString());
        if (index !== -1) throw new ConflictError("You have already liked this tip");
        tips.likes.push(userId);

        const dislikeIndex = tips.dislikes.findIndex((dislike: string) => dislike.toString() == userId.toString());
        if (dislikeIndex !== -1) tips.dislikes.splice(dislikeIndex, 1);
        return await tips.save();
    }

    async dislikeTips(userId: string, tipId: string): Promise<ITips | null> {
        const tips = await this.tipsRepository.findById(tipId);

        if (!tips) throw new NotFoundError("Tips not found");

        // Check if already disliked
        const dislikeIndex = tips.dislikes.findIndex((dislike: string) => dislike.toString() === userId.toString());
        if (dislikeIndex !== -1) throw new ConflictError("You have already disliked this tip");

        // Add to dislikes
        tips.dislikes.push(userId);

        // If user had liked before, remove from likes
        const likeIndex = tips.likes.findIndex((like: string) => like.toString() === userId.toString());
        if (likeIndex !== -1) tips.likes.splice(likeIndex, 1);

        return await tips.save();
    }
}
