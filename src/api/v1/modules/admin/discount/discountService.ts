import { NotFoundError } from "../../../../../constants/customErrors";
import { IDiscount } from "../../../../../models/discountModel";
import { deleteS3Object } from "../../../../../utils/v1/s3/image/deleteImageFromS3";
import { uploadImagesToS3 } from "../../../../../utils/v1/s3/image/uploadImagesToS3";
import { DiscountRepository } from "./discountRepository";
import QRCode from "qrcode";
export class DiscountService {
    constructor(private discountRepository: DiscountRepository) {}

    async createDiscount(data: IDiscount): Promise<IDiscount | null> {
        console.log(data);
        const newDiscount = await this.discountRepository.create(data);
        console.log(newDiscount);
        const qrData = `${newDiscount?._id}`;
        const qrImageBuffer = await QRCode.toBuffer(qrData, { type: "png" });

        const fakeFile: Express.Multer.File = {
            fieldname: "qrCode",
            originalname: `${newDiscount?._id}-qrcode.png`,
            encoding: "7bit",
            mimetype: "image/png",
            buffer: qrImageBuffer,
            size: qrImageBuffer.length,
            stream: undefined as any,
            destination: "",
            filename: "",
            path: "",
        };

        const [qrUrl] = await uploadImagesToS3([fakeFile]);

        newDiscount.QRCode = qrUrl;

        return await newDiscount.save();
    }

    async getAllDiscountCards() {
        return await this.discountRepository.findAll();
    }
    async updateDiscountCard(cardId: string, body: any, image: string) {
       
        const discountCard = await this.discountRepository.findById(cardId);
        if (!discountCard) throw new NotFoundError("Discount card not found");

        const data: any = body;
        if (image) await deleteS3Object(discountCard.image);
        data.image = image;
        return await this.discountRepository.findByIdAndUpdate(cardId, data);
    }


    async deleteDiscountCard(cardId:string):Promise<IDiscount|null>{

        const discount = await this.discountRepository.findById(cardId);
        if(!discount) throw new NotFoundError("Dicount card not found");

        await this.discountRepository.findByIdAndDelete(cardId);
        return discount;

    }
}
