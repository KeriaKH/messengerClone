import { isSenderObject, Message } from "@/types/message";
import Image from "next/image";
import React from "react";
import { useAuth } from "./AuthContext";

export default function MessageBubble({
  item,
  isLast,
  isFirst,
}: {
  item: Message;
  isLast: boolean;
  isFirst: boolean;
}) {
  const { user } = useAuth();
  return (
    <div
      className={`flex items-end space-x-2 ${isFirst&&"mt-3"} ${
        isSenderObject(item.sender) && item.sender._id === user?.id
          ? "justify-end"
          : "justify-start"
      }`}
    >
      {isLast ? (
        isSenderObject(item.sender) &&
        item.sender._id !== user?.id && (
          <Image
            src={item.sender.avatar || "/avatar.jpg"}
            alt="avatar"
            width={30}
            height={30}
            className="rounded-full"
          />
        )
      ) : (
        <div className="w-[30px]"></div>
      )}

      <div
        className={` max-w-[40%] space-y-0.5 flex flex-col ${
          isSenderObject(item.sender) && item.sender._id === user?.id
            ? "items-end"
            : "items-start"
        }`}
      >
        <div
          className={`grid gap-0.5  ${
            item.images && item.images.length >= 1
              ? "grid-cols-3"
              : "grid-cols-1"
          }`}
          style={{ direction: item.sender === user?.id ? "rtl" : "ltr" }}
        >
          {item.images?.map((img, index) => {
            const isLarge = (item.images?.length || 0) < 2;

            return (
              <div
                key={index}
                className={`rounded-xl ${
                  isSenderObject(item.sender) && item.sender._id === user?.id
                    ? "justify-end flex"
                    : ""
                } overflow-hidden ${
                  isLarge ? "max-w-[200px] max-h-[200px]" : "h-[120px] w-full"
                }`}
              >
                <Image
                  src={img}
                  alt={`image-${index}`}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className={`rounded-xl ${
                    isLarge
                      ? "w-auto h-auto max-w-full max-h-full object-contain"
                      : "w-full h-full object-cover"
                  }`}
                />
              </div>
            );
          })}
        </div>
        <div>
          {isFirst && (
            <p className="text-xs ml-2 text-white/30">
              {isSenderObject(item.sender) &&
                item.sender._id !== user?.id &&
                item.sender.name}
            </p>
          )}
          <p
            className={`p-2 rounded-2xl shadow w-fit text-sm ${
              isSenderObject(item.sender) && item.sender._id === user?.id
                ? "bg-blue-500"
                : "bg-gray-500"
            }`}
            style={{
              wordBreak: "break-word", // ✨ Đây là chìa khóa
              whiteSpace: "pre-wrap", // ✨ Kết hợp với pre-wrap
              overflowWrap: "break-word", // ✨ Đảm bảo ngắt được từ dài
            }}
          >
            {item.text}
          </p>
        </div>
      </div>
    </div>
  );
}
