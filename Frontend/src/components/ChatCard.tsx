import Image from "next/image";
import React from "react";

export default function ChatCard() {
  return (
    <div className="w-full p-3 flex items-center space-x-2 hover:bg-white/10 rounded-xl transition">
      <Image src="/avatar.jpg" alt="avatar" width={45} height={45} className="rounded-full"/>
        <div className="flex-1 min-w-0">
            <p className="font-semibold">Thế Vinh</p>
            <p className="text-sm text-white/30 truncate">Tin nhắn cuối cùng được gửi đến</p>
        </div>
        <p className="text-sm text-white/30 text-end">35 phút</p>
    </div>
  );
}
