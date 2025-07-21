"use client";

import { chat } from "@/types/chat";
import { Option } from "@/types/customeType/customSelect";
import {
  formatTimeAgo,
  formatTimeAgoWithChat,
  getChatName
} from "@/utils/fomart";
import {
  faA,
  faImage,
  faPalette,
  faPencil,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useMemo, useState } from "react";
import ChatImage from "./ChatImage";
import { useAuth } from "./context/AuthContext";
import { useSocket } from "./context/SocketContext";
import CustomSelect from "./CustomSelect";
import MemberList from "./MemberList";

export default function Profile({ chat }: { chat: chat }) {
  const chatOptions: Option[] = [
    {
      text: "Đổi chủ đề",
      icon: faPalette,
    },
    {
      text: "Đổi biểu tượng cảm xúc",
      icon: faThumbsUp,
    },
    {
      text: "Chỉnh sửa biệt danh",
      icon: faA,
    },
  ];
  const chatOptions2: Option[] = [
    {
      text: "Đổi chủ đề",
      icon: faPalette,
    },
    {
      text: "Đổi biểu tượng cảm xúc",
      icon: faThumbsUp,
    },
    {
      text: "Chỉnh sửa biệt danh",
      icon: faA,
    },
    {
      text: "Đổi tên nhóm",
      icon: faPencil,
    },
    {
      text: "Đổi ảnh nhóm",
      icon: faImage,
    },
  ];

  const { onlineUsers } = useSocket();
  const { user } = useAuth();
  console.log(formatTimeAgoWithChat(chat, user?.id || ""))
  const ChatOnline = useMemo(() => {
    return chat.isGroup
      ? chat.members.some(
          (member) =>
            member.id._id !== user?.id && onlineUsers.includes(member.id._id)
        )
      : onlineUsers.includes(
          chat.members.find((m) => m.id._id !== user?.id)?.id._id || ""
        );
  }, [chat, onlineUsers, user]);

  const [lastSeen, setLastSeen] = useState(
    formatTimeAgoWithChat(chat, user?.id || "")
  );
  const [wasOnline, setWasOnline] = useState(ChatOnline);

  useEffect(() => {
    if (wasOnline && !ChatOnline) {
      setLastSeen(formatTimeAgo(new Date().toISOString()));
    }
    setWasOnline(ChatOnline);
  }, [onlineUsers, wasOnline, ChatOnline]);

  return (
    <div className="h-full w-[23%] shadow rounded-2xl bg-[rgba(31,31,31,255)] p-5 flex flex-col items-center">
      <div className="space-y-1 flex flex-col items-center">
        <ChatImage chat={chat} />
        <p className="text-xl font-semibold text-center">
          {getChatName(chat, user?.id || "")}
        </p>
        <p className="text-sm text-white/30 truncate">
          {ChatOnline
            ? "Đang hoạt động"
            : "hoạt động " + lastSeen}
        </p>
      </div>
      <CustomSelect
        title="Tùy chỉnh đoạn chat"
        options={chat.isGroup ? chatOptions2 : chatOptions}
      />
      {chat.isGroup && (
        <MemberList title="Danh sách thành viên" members={chat.members} />
      )}
    </div>
  );
}
