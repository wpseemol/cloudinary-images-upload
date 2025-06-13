"use server";

import { Readable } from "stream";
import cloudinary from "../cloudinary";

/**
 * Uploads a file to Cloudinary
 * @param formData - FormData containing the file to upload
 * @returns Object with success/error status and upload result
 */
export async function uploadOnCloudinary(formData: FormData) {
     try {
          // 1. Get the file from FormData
          const file = formData.get("images") as File | null;

          // 2. Validate file exists
          if (!file) {
               console.log("No file provided");
               return { error: "No file provided" };
          }

          // 3. Prepare filename (remove extension)
          const originalFilename = file.name.replace(/\.[^/.]+$/, "");

          // 4. Convert file to Buffer for streaming
          const buffer = Buffer.from(await file.arrayBuffer());

          // 5. Upload to Cloudinary using streams
          const result = await new Promise((resolve, reject) => {
               // Create upload stream with Cloudinary options
               const uploadStream = cloudinary.uploader.upload_stream(
                    {
                         folder: "my_uploads", // Target folder in Cloudinary
                         public_id: `user-upload_${Date.now()}_${originalFilename}`, // Unique filename
                         resource_type: "auto", // Auto-detect file type
                    },
                    (error, result) => {
                         if (error) {
                              console.error("Cloudinary upload error:", error);
                              reject(error);
                         } else {
                              resolve({
                                   ...result,
                                   originalFilename: file.name, // Include original filename
                              });
                         }
                    }
               );

               // Pipe the file buffer to Cloudinary
               Readable.from(buffer).pipe(uploadStream);
          });

          // 6. Return success response
          return {
               success: true,
               result,
          };
     } catch (error) {
          // 7. Handle errors
          console.error("Upload failed:", error);
          return {
               error: "Upload failed",
               details: error instanceof Error ? error.message : String(error),
          };
     }
}
