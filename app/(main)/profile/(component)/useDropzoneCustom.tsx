import {useState} from 'react';

const useDropzoneCustom = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

    const handleImageDrop = (file: File) => {
        setImageFile(file);
        setImagePreviewUrl(URL.createObjectURL(file));
    };

    return {imageFile,setImageFile,imagePreviewUrl,setImagePreviewUrl,handleImageDrop}
};

export default useDropzoneCustom;
