import { chat } from "@/types/chat";
import { getChatOnline } from "@/utils/fomart";
import Image from "next/image";
import React from "react";
import { useAuth } from "./context/AuthContext";

export default function ChatImage({ chat }: { chat: chat }) {
  const { user } = useAuth();
  const raw = chat.members.find((item) => item.id._id !== user?.id);
  return chat.isGroup ? (
    chat.image.trim() !== "" ? (
      <div className="relative w-[45px] h-[45px]">
        <Image
          src={chat.image}
          alt="avatar"
          width={45}
          height={45}
          className="rounded-full w-[45px] h-[45px] object-cover"
        />
        {getChatOnline(chat, user?.id || "") && (
          <div className="absolute bottom-0 right-0 size-3.5 rounded-full bg-green-700 border-2 border-black shadow"></div>
        )}
      </div>
    ) : (
      <div className="relative w-[50px] h-[50px]">
        <Image
          src={chat.members[0].id.avatar}
          alt="avatar"
          width={35}
          height={35}
          className="rounded-full absolute top-0 right-0 w-[35px] h-[35px] object-cover"
        />
        {chat.members[1] && (
          <Image
            src={chat.members[1].id.avatar}
            alt="avatar"
            width={35}
            height={35}
            className="rounded-full absolute left-0 bottom-0 w-[35px] h-[35px] object-cover"
          />
        )}
        {getChatOnline(chat, user?.id || "") && (
          <div className="absolute bottom-0 right-0 size-3.5 rounded-full bg-green-700 border-2 border-black shadow"></div>
        )}
      </div>
    )
  ) : (
    <div className="relative w-[45px] h-[45px]">
      <Image
        src={raw?.id.avatar || "/avatar.jpg"}
        alt="avatar"
        width={45}
        height={45}
        className="rounded-full w-[45px] h-[45px] object-cover"
      />
      {getChatOnline(chat, user?.id || "") && (
        <div className="absolute bottom-0 right-0 size-3.5 rounded-full bg-green-700 border-2 border-black shadow"></div>
      )}
    </div>
  );
}
