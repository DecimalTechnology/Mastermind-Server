import { IDiscount } from "../../../../../models/discountModel";
import { uploadImagesToS3 } from "../../../../../utils/v1/s3/image/uploadImagesToS3";
import { DiscountRepository } from "./discountRepository";
import QRCode from "qrcode";
export class DiscountService {
    constructor(private discountRepository: DiscountRepository) {}

    async createDiscount(data: IDiscount): Promise<IDiscount|null> {

        const newDiscount = await this.discountRepository.create(data);
       // 1. Generate QR code buffer
            const qrData = `${newDiscount?._id}`;
            const qrImageBuffer = await QRCode.toBuffer(qrData, { type: "png" });

            // 2. Reuse uploadImagesToS3 by faking an Express.Multer.File object
            const fakeFile: Express.Multer.File = {
                fieldname: "qrCode",
                originalname: `${newDiscount?._id}-qrcode.png`,
                encoding: "7bit",
                mimetype: "image/png",
                buffer: qrImageBuffer,
                size: qrImageBuffer.length,
                stream: undefined as any, // not used since we rely on buffer
                destination: "",
                filename: "",
                path: "",
            };

            const [qrUrl] = await uploadImagesToS3([fakeFile]);
               console.log(qrUrl)
            // 3. Save discount with QR code URL
            newDiscount.QRCode = qrUrl;

            return await newDiscount.save()
    }
}