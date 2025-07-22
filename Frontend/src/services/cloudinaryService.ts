import api from "./api";

export const uploadImage = async (selectedFile: File): Promise<string | null> => {
    if (!selectedFile) {
        console.error("No file selected for upload.");
        return null;
    }
    try {
        const formData = new FormData();
        formData.append("image", selectedFile);
        const res = await api.post("api/cloudinary/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        if (res.data)
            return res.data.imageUrl
        return null
    } catch (error) {
        console.error("Error uploading image:", error);
        return null;
    }
}

export const uploadImages = async (selectedFiles: File[]): Promise<string[] | null> => {
    if (!selectedFiles || selectedFiles.length === 0) {
        console.error("No files selected for upload.");
        return null;
    }
    try {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append("images", file);
        });
        console.log(`Uploading ${selectedFiles.length} images...`);
        const res = await api.post("api/cloudinary/uploadMultiple", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        if (res.data) {
            return res.data.imageUrls;
        }
        return null;
    } catch (error) {
        console.error("Error uploading images:", error);
        return null;
    }
}