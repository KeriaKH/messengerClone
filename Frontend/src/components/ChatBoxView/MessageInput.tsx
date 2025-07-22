import {
  faFaceSmile,
  faImage,
  faPaperPlane,
  faSpinner,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React from "react";

interface MessageInputProps {
  selectedFiles: File[];
  previewImages: string[];
  setSelectedFiles: (files: File[]) => void;
  setPreviewImages: (images: string[]) => void;
  handleSend: () => void;
  handleSendEmoji: () => void;
  text: string;
  setText: (text: string) => void;
  setShowPicker: (show: boolean) => void;
  showPicker: boolean;
  isLoading: boolean;
}

export default function MessageInput({
  selectedFiles,
  previewImages,
  setSelectedFiles,
  setPreviewImages,
  handleSend,
  handleSendEmoji,
  text,
  setText,
  setShowPicker,
  showPicker,
  isLoading,
}: MessageInputProps) {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    if (selectedFiles.length + files.length > 10) {
      alert("Chỉ được chọn tối đa 10 ảnh");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB per file

    const validFiles: File[] = [];
    const previews: string[] = [];

    files.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} không phải là ảnh hợp lệ`);
        return;
      }

      if (file.size > maxSize) {
        alert(`File ${file.name} vượt quá 5MB`);
        return;
      }

      validFiles.push(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push(e.target?.result as string);
        if (previews.length === validFiles.length) {
          setPreviewImages([...previewImages, ...previews]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (validFiles.length > 0) {
      setSelectedFiles([...selectedFiles, ...validFiles]);
    }

    event.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setPreviewImages(previewImages.filter((_, i) => i !== index));
  };
  const handleRemoveAllImages = () => {
    setSelectedFiles([]);
    setPreviewImages([]);
  };
  return (
    <>
      {selectedFiles?.length > 0 && (
        <div className="p-3 bg-black/20 border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/70">
              Đã chọn {selectedFiles.length} ảnh
            </span>
            <button
              className="text-red-400 hover:text-red-300 text-sm"
              onClick={handleRemoveAllImages}
            >
              Hủy
            </button>
          </div>

          <div className="flex space-x-3 overflow-x-auto pb-2">
            {previewImages?.map((preview, index) => (
              <div key={index} className="relative flex-shrink-0 mt-2">
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <button
                  className="absolute -top-2 -right-2 bg-black text-white rounded-full size-7 flex items-center justify-center text-sm shadow hover:bg-gray-700 transition"
                  onClick={() => handleRemoveImage(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="w-full flex items-center px-3 py-2 space-x-3 shadow">
        <label className="rounded-full hover:bg-white/10 size-10 flex items-center justify-center cursor-pointer">
          <FontAwesomeIcon icon={faImage} />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            multiple
            onChange={handleFileSelect}
          />
        </label>
        <div className=" bg-white/10 flex-1 rounded-2xl flex items-center">
          <input
            type="text"
            value={text || ""}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            className="p-2 px-4 focus:outline-none flex-1"
            placeholder="Aa"
          />

          <FontAwesomeIcon
            icon={faFaceSmile}
            onClick={() => setShowPicker(!showPicker)}
            className=" p-3 rounded-full hover:bg-white/10 size-5"
          />
        </div>
        {isLoading ? (
          <FontAwesomeIcon icon={faSpinner} className="animate-spin size-5" />
        ) : text.trim() === "" && selectedFiles.length === 0 ? (
          <FontAwesomeIcon
            icon={faThumbsUp}
            onClick={handleSendEmoji}
            className=" p-3 rounded-full hover:bg-white/10 size-5"
          />
        ) : (
          <FontAwesomeIcon
            icon={faPaperPlane}
            onClick={handleSend}
            className=" p-3 rounded-full hover:bg-white/10 size-5"
          />
        )}
      </div>
    </>
  );
}
