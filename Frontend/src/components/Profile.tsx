"use client";

import { chat } from "@/types/chat";
import { Option } from "@/types/customeType/customSelect";
import {
  formatTimeAgoWithChat,
  getChatName,
  getChatOnline,
} from "@/utils/fomart";
import { faA, faImage, faPalette, faPencil, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import ChatImage from "./ChatImage";
import { useAuth } from "./context/AuthContext";
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
  const { user } = useAuth();
  return (
    <div className="h-full w-[23%] shadow rounded-2xl bg-[rgba(31,31,31,255)] p-5 flex flex-col items-center">
      <div className="space-y-1 flex flex-col items-center">
        <ChatImage chat={chat}/>
        <p className="text-xl font-semibold text-center">
          {getChatName(chat, user?.id || "")}
        </p>
        <p className="text-sm text-white/30 truncate">
          {getChatOnline(chat, user?.id || "")
            ? "Đang hoạt động"
            : "hoạt động " + formatTimeAgoWithChat(chat, user?.id || "")}
        </p>
      </div>
      <CustomSelect title="Tùy chỉnh đoạn chat" options={chat.isGroup?chatOptions2:chatOptions} />
      {chat.isGroup&&<MemberList title="Danh sách thành viên" members={chat.members}/>}
    </div>
  );
}
