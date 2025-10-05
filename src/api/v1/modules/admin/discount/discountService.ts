import { IDiscount } from "../../../../../models/discountModel";
import { uploadImagesToS3 } from "../../../../../utils/v1/s3/image/uploadImagesToS3";
import { DiscountRepository } from "./discountRepository";
import QRCode from "qrcode";
export class DiscountService {
    constructor(private discountRepository: DiscountRepository) {}

    async createDiscount(data: IDiscount): Promise<IDiscount | null> {
        const newDiscount = await this.discountRepository.create(data);
       
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
}
