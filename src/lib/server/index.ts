"use server";

import { Readable } from "stream";
import cloudinary from "../cloudinary";

export async function uploadOnCloudinary(formData: FormData) {
     try {
          const file = formData.get("images") as File | null;
          if (!file) {
               console.log("No file provided");
               return { error: "No file provided" };
          }

          const originalFilename = file.name.replace(/\.[^/.]+$/, "");
          const buffer = Buffer.from(await file.arrayBuffer());

          const result = await new Promise((resolve, reject) => {
               const uploadStream = cloudinary.uploader.upload_stream(
                    {
                         folder: "my_uploads",
                         public_id: "test-" + originalFilename,
                    },
                    (error, result) => {
                         if (error) {
                              console.error("Cloudinary upload error:", error);
                              reject(error);
                         } else {
                              resolve({
                                   ...result,
                                   originalFilename: "test-" + file.name,
                              });
                         }
                    }
               );

               Readable.from(buffer).pipe(uploadStream);
          });

          console.log("success:", result);

          return {
               success: true,
               result,
          };
     } catch (error) {
          console.error("Upload failed:", error);
          return {
               error: "Upload failed",
               details: error instanceof Error ? error.message : String(error),
          };
     }
}
