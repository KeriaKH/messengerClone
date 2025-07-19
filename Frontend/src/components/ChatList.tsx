"use client";

import { faPenToSquare, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import ChatCard from "./ChatCard";
import { chat } from "@/types/chat";
import { getChat } from "@/services/userService";
import { useAuth } from "./context/AuthContext";

export default function ChatList({
  setSelectedChat,
}: {
  setSelectedChat: (chat: chat) => void;
}) {
  const [chats, setChats] = useState<chat[] | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;
    getChat(user.id).then((res) => {
      console.log(res);
      setChats(res);
    });
  }, [user?.id]);
  return (
    <div className="h-full w-[23%] shadow rounded-2xl bg-[rgba(31,31,31,255)] p-3 space-y-3 flex flex-col">
      <div className="text-xl font-bold flex justify-between items-center">
        <h2 className="text-2xl">Đoạn chat</h2>
        <FontAwesomeIcon
          icon={faPenToSquare}
          className="p-2.5 hover:bg-white/30 bg-white/20 rounded-full size-5"
        />
      </div>
      <div className="w-full flex items-center bg-[rgba(58,59,60,255)] p-2 px-4 rounded-2xl">
        <input
          type="text"
          className="w-full focus:outline-none "
          placeholder="Tìm kiếm trên Messenger"
        />
        <FontAwesomeIcon icon={faSearch} className="size-5" />
      </div>
      <div className="overflow-y-auto overflow-x-hidden h-full custom-scrollbar">
        {chats?.map((item, index) => (
          <ChatCard key={index} item={item} setSelectedChat={setSelectedChat} />
        ))}
      </div>
    </div>
  );
}
