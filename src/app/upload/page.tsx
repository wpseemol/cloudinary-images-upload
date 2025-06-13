"use client";
import { uploadOnCloudinary } from "@/lib/server";
import Image from "next/image";
import React, { useRef, useState } from "react";

export default function UploadPage() {
     const fileInputRef = useRef<HTMLInputElement>(null);
     const [preview, setPreview] = useState<string | null>(null);
     const [fileName, setFileName] = useState<string>("");
     const [uploadProgress, setUploadProgress] = useState<number>(0);
     const [isUploading, setIsUploading] = useState<boolean>(false);

     const handleButtonClick = () => {
          fileInputRef.current?.click();
     };

     const handleFileChange = async (
          e: React.ChangeEvent<HTMLInputElement>
     ) => {
          const file = e.target.files?.[0];
          if (file) {
               setFileName(file.name);
               const reader = new FileReader();
               reader.readAsDataURL(file);
               reader.onloadend = () => setPreview(reader.result as string);
          }
     };

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();

          if (!fileInputRef.current?.files?.[0]) {
               alert("Please select a file first!");
               return;
          }

          const file = fileInputRef.current.files[0];
          const formData = new FormData();
          formData.append("images", file);

          setIsUploading(true);
          setUploadProgress(0);

          try {
               // Create a progress tracking function
               const updateProgress = (progress: number) => {
                    setUploadProgress(progress);
               };

               // Simulate progress (in a real app, you'd use actual upload progress)
               // This is a mock implementation since Cloudinary's SDK doesn't provide progress events
               const progressInterval = setInterval(() => {
                    setUploadProgress((prev) => {
                         const newProgress = prev + 1;
                         if (newProgress >= 100)
                              clearInterval(progressInterval);
                         return newProgress;
                    });
               }, 10);

               const response = await uploadOnCloudinary(formData);
               clearInterval(progressInterval);
               setUploadProgress(100);

               console.log(response);
               alert("Image uploaded successfully!");
          } catch (error) {
               console.error("Upload failed:", error);
               alert("Upload failed!");
          } finally {
               setIsUploading(false);
          }
     };

     return (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
               <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center gap-6 w-full max-w-md"
               >
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                         Upload Image
                    </h1>
                    <div className="flex flex-col items-center gap-4 w-full">
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
                         <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                              disabled={isUploading}
                         />
                         {preview && (
                              <Image
                                   src={preview}
                                   alt="Preview"
                                   width={150}
                                   height={150}
                                   className="w-48 h-48 object-cover rounded-lg border-2 border-purple-300 shadow"
                              />
                         )}
                         {fileName && (
                              <span className="text-gray-600 text-sm">
                                   {fileName}
                              </span>
                         )}
                         {isUploading && (
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                   <div
                                        className="bg-blue-600 h-2.5 rounded-full"
                                        style={{ width: `${uploadProgress}%` }}
                                   ></div>
                              </div>
                         )}
                         {isUploading && (
                              <span className="text-gray-600 text-sm">
                                   Uploading: {uploadProgress}%
                              </span>
                         )}
                    </div>
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
