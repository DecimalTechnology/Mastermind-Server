import cloudinary from "./cloudinary";


export async function deleteImageFromCloudinary(imageUrl: string): Promise<void> {
  try {
    // Extract the part after "/upload/"
    const parts = imageUrl.split("/upload/")[1]?.split("/") ?? [];
    
    if (parts.length === 0) {
      throw new Error("Invalid Cloudinary URL");
    }

    // Check if the first part is a version number (e.g., v1740728694)
    if (parts[0].startsWith("v") && !isNaN(Number(parts[0].substring(1)))) {
      parts.shift(); // Remove version number
    }

    // Join remaining parts to get the public ID and remove file extension
    const publicId = parts.join("/").replace(/\.[^/.]+$/, "");

    // Delete the image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      console.log(`Image deleted successfully: ${publicId}`);
    } else {
      console.log(`Failed to delete image: ${publicId}`);
    }
  } catch (error) {
    console.error("Error deleting image:", error);
  }
}

