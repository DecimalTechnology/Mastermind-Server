import mongoose,{Document} from "mongoose";

export interface IDiscount extends Document {
    restaurantName:string;
    discountPercentage:string;
    description?:string;
    isActive:boolean;
    image:string;
    QRCode:string;
}

const discountSchema = new mongoose.Schema(
    {
        restaurantName: { type: String, required: true },
        discountPercentage: { type: Number, required: true },
        description:{type:String},
        isActive: { type: Boolean, default: true },
        image: { type: String },
        QRCode: { type: String },

    },
    { timestamps: true }
);

export default mongoose.model("Discount", discountSchema);
