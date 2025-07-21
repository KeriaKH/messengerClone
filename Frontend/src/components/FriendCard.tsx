import { friend } from "@/types/friend";
import { formatTimeAgo } from "@/utils/fomart";
import { faUserXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSocket } from "./context/SocketContext";

export default function FriendCard({
  friend,
  onDelete,
}: {
  friend: friend;
  onDelete: (id: string) => void;
}) {
  const { onlineUsers } = useSocket();
  const [lastSeen, setLastSeen] = useState(friend.lastSeen);
  const [wasOnline, setWasOnline] = useState(onlineUsers.includes(friend._id));

  useEffect(() => {
    const isOnlineNow = onlineUsers.includes(friend._id);
    if (wasOnline && !isOnlineNow) {
      console.log("formatTimeAgo", new Date().toISOString());
      setLastSeen(new Date().toISOString());
    }
    setWasOnline(isOnlineNow);
  }, [onlineUsers, wasOnline, friend._id]);

  return (
    <div className="w-full p-3 flex items-center space-x-2 hover:bg-white/10 rounded-xl transition">
      <div className="relative w-[45px] h-[45px]">
        <Image
          src={friend.avatar.trim() !== "" ? friend.avatar : "/avatar.jpg"}
          alt="avatar"
          width={45}
          height={45}
          className="rounded-full w-[45px] h-[45px] object-cover"
        />
        {onlineUsers.includes(friend._id) && (
          <div className="absolute bottom-0 right-0 size-3.5 rounded-full bg-green-700 border-2 border-black shadow"></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold">{friend.name}</p>
        <p className="text-sm text-white/30 truncate">
          {onlineUsers.includes(friend._id)
            ? "Đang hoạt động"
            : "hoạt động " + formatTimeAgo(lastSeen)}
        </p>
      </div>
      <div
        className="text-xs space-x-2 flex items-center  bg-black p-2 rounded-xl cursor-pointer hover:bg-black/10 transition"
        onClick={() => onDelete(friend._id)}
      >
        <FontAwesomeIcon icon={faUserXmark} />
        <p>Hủy kết bạn</p>
      </div>
    </div>
  );
}
