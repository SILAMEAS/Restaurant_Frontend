// components/ImageDropzone.tsx
import React from "react";
import { useDropzone } from "react-dropzone";

interface ImageDropzoneProps {
    onDrop: (file: File) => void;
    previewUrl?: string;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onDrop, previewUrl }) => {
    const { getRootProps, getInputProps } = useDropzone({
        accept: { "image/*": [] },
        multiple: false,
        onDrop: (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                onDrop(acceptedFiles[0]);
            }
        },
    });

    return (
        <div
            {...getRootProps()}
            className="flex items-center justify-center border border-dashed border-gray-300 rounded-md p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
        >
            <input {...getInputProps()} />
            {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="max-h-32 object-contain" />
            ) : (
                <p className="text-sm text-muted-foreground">Drag & drop or click to upload an image</p>
            )}
        </div>
    );
};
