"use client";

import {
  addFriend,
  getFriendRequest,
  rejectFriend,
} from "@/services/friendRequestService";
import { friendRequest } from "@/types/friendRequest";
import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import FriendRequestCard from "./FriendRequestCard";
import { getSocket } from "@/lib/socket/socket";

export default function FriendRequest() {
  const { user } = useAuth();
  const [FriendRequest, setFriendRequest] = useState<friendRequest[]>([]);
  useEffect(() => {
    if (!user) return;
    getFriendRequest(user?.id).then((res) => {
      console.log(res);
      setFriendRequest(res || []);
    });
  }, [user]);

  useEffect(() => {
    const socket = getSocket();
    const handleReceive = (data: friendRequest) => {
      console.log("đã nhận");
      setFriendRequest([...FriendRequest, data]);
    };
    socket.on("friend_request_received", handleReceive);
  }, [FriendRequest]);

  const handleAccept = async (item: friendRequest) => {
    const data = {
      _id: item._id,
      sender: item.sender._id,
      receiver: item.receiver,
    };
    await addFriend(data);
    setFriendRequest(FriendRequest.filter((req) => req._id !== item._id));
  };

  const handleReject = async (id: string) => {
    await rejectFriend(id);
    setFriendRequest(FriendRequest.filter((req) => req._id !== id));
  };

  return (
    <div className="h-full w-[32%] lg:w-[23%] shadow rounded-2xl bg-[rgba(31,31,31,255)] p-3 space-y-3 flex flex-col">
      <h2 className="text-2xl font-bold">Lời mời kết bạn</h2>
      <div className="overflow-y-auto overflow-x-hidden h-[45%] custom-scrollbar">
        {FriendRequest?.map((item, index) => (
          <FriendRequestCard
            key={index}
            item={item}
            handleAccept={handleAccept}
            handleReject={handleReject}
          />
        ))}
      </div>
    </div>
  );
}
