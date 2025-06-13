import { IChapter } from "../../../../../interfaces/models/IChaper";
import { Chapter } from "../../../../../models/chapterModal";
import { Local } from "../../../../../models/localModel";
import User from "../../../../../models/userModel";
import { BaseRepository } from "../../shared/repositories/baseRepository";

export class ChapterRepository extends BaseRepository<IChapter> {
    constructor() {
        super(Chapter);
    }

  async findAllChapters(): Promise<any> {
      
     const res =  await User.find().populate("nationId")
      
        
    
        return res;
        
}

}
