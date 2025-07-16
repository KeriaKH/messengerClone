import { faUserXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React from "react";

export default function FriendCard() {
  return (
    <div className="w-full p-3 flex items-center space-x-2 hover:bg-white/10 rounded-xl transition">
      <Image
        src="/avatar.jpg"
        alt="avatar"
        width={45}
        height={45}
        className="rounded-full"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold">Thế Vinh</p>
        <p className="text-sm text-white/30 truncate">
          Đang hoạt động
        </p>
      </div>
      <div className="text-xs space-x-2 flex items-center  bg-black p-2 rounded-xl cursor-pointer hover:bg-black/10 transition">
        <FontAwesomeIcon icon={faUserXmark}/>
        <p>Hủy kết bạn</p>
      </div>
    </div>
  );
}
