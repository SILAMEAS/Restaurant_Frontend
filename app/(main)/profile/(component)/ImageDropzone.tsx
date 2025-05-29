// ImageDropzone.tsx
import React from "react";
import { useDropzone } from "react-dropzone";
import  {InterfaceUseDropzoneCustomExport} from "./useDropzoneCustom";

interface ImageDropzoneProps {
    multiple?: boolean;
    dropzoneCustom: InterfaceUseDropzoneCustomExport
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({ multiple = false,dropzoneCustom }) => {
    const {
        imagePreviewUrl,
        imagePreviewUrls,
        handleImageDrop,
        handleImageDrops,
    } = dropzoneCustom;

    const { getRootProps, getInputProps } = useDropzone({
        accept: { "image/*": [] },
        multiple,
        onDrop: (acceptedFiles: File[]) => {
            if (acceptedFiles.length === 0) return;
            if (multiple) {
                handleImageDrops(acceptedFiles);
            } else {
                handleImageDrop(acceptedFiles[0]);
            }
        },
    });

    return (
        <div
            {...getRootProps()}
            className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-md p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
        >
            <input {...getInputProps()} />
            {multiple && imagePreviewUrls?.length ? (
                <div className="flex flex-wrap gap-2">
                    {imagePreviewUrls.map((url, index) => (
                        <img
                            key={index}
                            src={url.url}
                            alt={`Preview ${index + 1}`}
                            className="h-24 object-contain rounded"
                        />
                    ))}
                </div>
            ) : imagePreviewUrl ? (
                <img src={imagePreviewUrl.url} alt="Preview" className="max-h-32 object-contain" />
            ) : (
                <p className="text-sm text-muted-foreground text-center">
                    Drag & drop or click to upload {multiple ? "images" : "an image"}
                </p>
            )}
        </div>
    );
};
