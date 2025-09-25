import tipsModel, { ITips } from "../../../../../models/tipsModel";
import { BaseRepository } from "../../shared/repositories/baseRepository";

export class TipsRepository extends BaseRepository<ITips> {
  constructor(){
    super(tipsModel);
  }
}