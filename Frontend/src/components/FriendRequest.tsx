"use client";

import FriendRequestCard from "./FriendRequestCard";
import FriendRequestCard2 from "./FriendRequestCard2";

export default function FriendRequest() {
  return (
    <div className="h-full w-[23%] shadow rounded-2xl bg-[rgba(31,31,31,255)] p-3 space-y-3 flex flex-col">
      <h2 className="text-2xl font-bold">Lời mời kết bạn</h2>
      <div className="overflow-y-auto overflow-x-hidden h-[45%] custom-scrollbar">
        {Array.from({ length: 20 }).map((_, index) => (
          <FriendRequestCard key={index} />
        ))}
      </div>
      <h2 className="text-2xl font-bold">Những người bạn có thể biết</h2>
      <div className="overflow-y-auto overflow-x-hidden h-[45%] custom-scrollbar">
        {Array.from({ length: 20 }).map((_, index) => (
          <FriendRequestCard2 key={index} />
        ))}
      </div>
    </div>
  );
}
