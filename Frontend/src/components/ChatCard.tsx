import { chat } from "@/types/chat";
import Image from "next/image";
import React from "react";
import { useAuth } from "./AuthContext";
import { formatTimeAgo, getChatName, getChatOnline } from "@/utils/fomart";

export default function ChatCard({
  item,
  setSelectedChat,
}: {
  item: chat;
  setSelectedChat: (chat: chat) => void;
}) {
  const { user } = useAuth();
  return (
    <div
      className="w-full p-3 flex items-center space-x-2 hover:bg-white/10 rounded-xl transition"
      onClick={() => setSelectedChat(item)}
    >
      <div className="relative w-[45px] h-[45px]">
        <Image
          src="/avatar.jpg"
          alt="avatar"
          width={45}
          height={45}
          className="rounded-full"
        />
        {getChatOnline(item,user?.id || "")&&
        <div className="absolute bottom-0 right-0 size-3.5 rounded-full bg-green-700 border-2 border-black shadow"></div>}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold">{getChatName(item, user?.id || "")}</p>
        <p className="text-sm text-white/30 truncate">
          {item.lastMessage.text}
        </p>
      </div>
      <p className="text-sm text-white/30 text-end">
        {formatTimeAgo(item.lastMessage.createdAt)}
      </p>
    </div>
  );
}
