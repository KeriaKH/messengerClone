import { getSocket } from "@/lib/socket/socket";
import { friendSuggest } from "@/types/friendRequest";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "./context/AuthContext";

export default function FriendRequestCard2({ item }: { item: friendSuggest }) {
  const { user } = useAuth();
  const [isSend,setIsSend]=useState(false)
  
  const handleSend = async () => {
    if (!user||isSend) return;
    const socket=getSocket()
    const data={sender:user?.id,receiver:item._id}
    await socket.emit("send_request",data)
    setIsSend(true)
  };
  return (
    <div className="w-full p-3 flex items-center space-x-2 hover:bg-white/10 rounded-xl transition">
      <Image
        src={item.avatar.trim() !== "" ? item.avatar : "/avatar.jpg"}
        alt="avatar"
        width={45}
        height={45}
        className="rounded-full w-[45px] h-[45px] object-cover"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold">{item.name}</p>
      </div>
      <div className="text-xs bg-blue-500/50 text-blue-200 hover:bg-blue-500/30 cursor-pointer p-2 rounded-xl transition" onClick={handleSend}>
        {isSend?"Đã gửi":"Gửi lời mời"}
      </div>
    </div>
  );
}
