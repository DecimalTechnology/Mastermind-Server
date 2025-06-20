import { UserRepository } from "../../shared/repositories/userRepository";
import { TestimonialRepository } from "./testimonialRepository";

export class TestimonialService{
    constructor(private testimonialRepository:TestimonialRepository,private userRepository:UserRepository){

    }
}