"use client";
import { uploadOnCloudinary } from "@/lib/server";
import Image from "next/image";
import React, { useRef, useState } from "react";

/**
 * Component for uploading images to Cloudinary with progress tracking
 */
export default function UploadPage() {
     // Refs and State
     const fileInputRef = useRef<HTMLInputElement>(null);
     const [preview, setPreview] = useState<string | null>(null);
     const [fileName, setFileName] = useState<string>("");
     const [uploadProgress, setUploadProgress] = useState<number>(0);
     const [isUploading, setIsUploading] = useState<boolean>(false);

     /**
      * Triggers the hidden file input click
      */
     const handleButtonClick = () => {
          fileInputRef.current?.click();
     };

     /**
      * Handles file selection and preview generation
      */
     const handleFileChange = async (
          e: React.ChangeEvent<HTMLInputElement>
     ) => {
          const file = e.target.files?.[0];
          if (!file) return;

          // 1. Set filename
          setFileName(file.name);

          // 2. Generate preview
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = () => setPreview(reader.result as string);
     };

     /**
      * Handles form submission and file upload
      */
     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();

          // 1. Validate file exists
          if (!fileInputRef.current?.files?.[0]) {
               alert("Please select a file first!");
               return;
          }

          const file = fileInputRef.current.files[0];
          const formData = new FormData();
          formData.append("images", file);

          // 2. Start upload process
          setIsUploading(true);
          setUploadProgress(0);

          try {
               // 3. Simulate progress (since Cloudinary SDK doesn't provide progress events)
               // In a real app, you might use:
               // - XMLHttpRequest with progress events
               // - Cloudinary client-side upload
               const progressInterval = setInterval(() => {
                    setUploadProgress((prev) => {
                         const newProgress = Math.min(prev + 1, 100); // Cap at 90% until complete
                         return newProgress;
                    });
               }, 1);

               // 4. Perform actual upload
               const response = await uploadOnCloudinary(formData);

               // 5. Complete progress
               clearInterval(progressInterval);
               setUploadProgress(100);

               // 6. Handle response
               console.log("Upload successful:", response);
               alert("Image uploaded successfully!");
          } catch (error) {
               // 7. Handle errors
               console.error("Upload failed:", error);
               alert("Upload failed!");
          } finally {
               // 8. Reset upload state
               setIsUploading(false);
          }
     };

     return (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
               <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center gap-6 w-full max-w-md"
               >
                    {/* Form Header */}
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                         Upload Image
                    </h1>

                    <div className="flex flex-col items-center gap-4 w-full">
                         {/* File Selection Button */}
                         <button
                              type="button"
                              onClick={handleButtonClick}
                              disabled={isUploading}
                              className={`px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg shadow hover:from-purple-600 hover:to-blue-600 transition font-semibold text-lg ${
                                   isUploading
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                              }`}
                         >
                              {fileName ? "Change Image" : "Choose Image"}
                         </button>

                         {/* Hidden File Input */}
                         <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                              disabled={isUploading}
                         />

                         {/* Image Preview */}
                         {preview && (
                              <Image
                                   src={preview}
                                   alt="Preview"
                                   width={150}
                                   height={150}
                                   className="w-48 h-48 object-cover rounded-lg border-2 border-purple-300 shadow"
                                   priority
                              />
                         )}

                         {/* File Name Display */}
                         {fileName && (
                              <span className="text-gray-600 text-sm">
                                   {fileName}
                              </span>
                         )}

                         {/* Progress Bar */}
                         {isUploading && (
                              <div className="w-full space-y-1">
                                   <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                             className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                             style={{
                                                  width: `${uploadProgress}%`,
                                             }}
                                        ></div>
                                   </div>
                                   <span className="text-gray-600 text-sm block text-center">
                                        Uploading: {uploadProgress}%
                                   </span>
                              </div>
                         )}
                    </div>

                    {/* Submit Button */}
                    <button
                         type="submit"
                         disabled={!preview || isUploading}
                         className={`w-full py-3 rounded-lg font-bold text-white transition ${
                              preview && !isUploading
                                   ? "bg-blue-600 hover:bg-blue-700"
                                   : "bg-gray-300 cursor-not-allowed"
                         }`}
                    >
                         {isUploading ? "Uploading..." : "Upload"}
                    </button>
               </form>
          </div>
     );
}
