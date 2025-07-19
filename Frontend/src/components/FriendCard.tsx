import { getSocket } from "@/socket/socket";
import { friend } from "@/types/friend";
import { formatTimeAgo } from "@/utils/fomart";
import { faUserXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function FriendCard({ friend }: { friend: friend }) {
  const [isOnline, setIsOnline] = useState(friend.isOnline);
  const [lastSeen, setLastSeen] = useState(friend.lastSeen);

  useEffect(() => {
    const socket = getSocket();

    const handleOnlineUsers = (onlineIds: string[]) => {
      setIsOnline(onlineIds.includes(friend._id));
    };

    const handleUserOffline = (data: { userId: string; lastSeen: string }) => {
      if (data.userId === friend._id) {
        setIsOnline(false);
        setLastSeen(data.lastSeen);
      }
    };

    socket.on("online_users", handleOnlineUsers);
    socket.on("user_offline", handleUserOffline);

    return () => {
      socket.off("online_users", handleOnlineUsers);
      socket.off("user_offline", handleUserOffline);
    };
  }, [friend._id]);
  return (
    <div className="w-full p-3 flex items-center space-x-2 hover:bg-white/10 rounded-xl transition">
      <div className="relative w-[45px] h-[45px]">
        <Image
          src={friend.avatar.trim()!==""?friend.avatar:"/avatar.jpg"}
          alt="avatar"
          width={45}
          height={45}
          className="rounded-full"
        />
        {isOnline && (
          <div className="absolute bottom-0 right-0 size-3.5 rounded-full bg-green-700 border-2 border-black shadow"></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold">{friend.name}</p>
        <p className="text-sm text-white/30 truncate">
          {isOnline
            ? "Đang hoạt động"
            : "hoạt động " + formatTimeAgo(lastSeen)}
        </p>
      </div>
      <div className="text-xs space-x-2 flex items-center  bg-black p-2 rounded-xl cursor-pointer hover:bg-black/10 transition">
        <FontAwesomeIcon icon={faUserXmark} />
        <p>Hủy kết bạn</p>
      </div>
    </div>
  );
}
