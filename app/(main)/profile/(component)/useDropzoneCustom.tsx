import React, { useState, useEffect } from 'react';
import {ImageUrl} from "@/lib/redux/type";
export interface InterfaceUseDropzoneCustomExport {
    imageFile: File | null
    imageFiles: File[] | null
    setImageFile: React.Dispatch<React.SetStateAction<File | null>>
    setImageFiles: React.Dispatch<React.SetStateAction<File[] | null>>
    imagePreviewUrl: ImageUrl | null
    imagePreviewUrls: ImageUrl[] | null
    handleImageDrop(
        file: File,
    ): void
    handleImageDrops: (files: File[]) => void
    setImagePreviewUrl: React.Dispatch<React.SetStateAction<ImageUrl | null>>
    setImagePreviewUrls: React.Dispatch<React.SetStateAction<ImageUrl[] | null>>
}

const useDropzoneCustom = ():InterfaceUseDropzoneCustomExport => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageFiles, setImageFiles] = useState<File[] | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<ImageUrl | null>(null);
    const [imagePreviewUrls, setImagePreviewUrls] = useState<ImageUrl[] | null>(null);

    const handleImageDrop = (file: File) => {
        setImageFile(file);
        const objectUrl = URL.createObjectURL(file);
        setImagePreviewUrl({url:objectUrl,publicId:null});
    };

    const handleImageDrops = (files: File[]) => {
        setImageFiles(files);
        const urls = files.map((file) => {
            return {url:  URL.createObjectURL(file),publicId:null}
        });
        setImagePreviewUrls(urls);
    };

    // Clean up object URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            if (imagePreviewUrl) {
                URL.revokeObjectURL(imagePreviewUrl.url);
            }
            if (imagePreviewUrls) {
                imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url.url));
            }
        };
    }, [imagePreviewUrl, imagePreviewUrls]);

    return {
        imageFile,
        setImageFile,
        imagePreviewUrl,
        setImagePreviewUrl,
        imageFiles,
        setImageFiles,
        imagePreviewUrls,
        setImagePreviewUrls,
        handleImageDrop,
        handleImageDrops,
    };
};

export default useDropzoneCustom;
