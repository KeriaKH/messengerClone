"use client";

import AddFriendPopUp from "@/components/AddFriendPopUp";
import { useAuth } from "@/components/AuthContext";
import ChatBox from "@/components/ChatBox";
import ChatList from "@/components/ChatList";
import FriendRequest from "@/components/FriendRequest";
import ListFriend from "@/components/ListFriend";
import Profile from "@/components/Profile";
import SideBar from "@/components/SideBar";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function HomePage() {
  const [openProfile, setOpenProfile] = useState(false);
  const [sideBarOption, setSideBarOption] = useState("message");
  const [showPopUp, setshowPopUp] = useState(false);
  const { isAuth} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuth) router.push("/");
  }, [isAuth, router]);


  return (
    <>
      <div className="flex h-screen w-full p-5 space-x-5">
        <SideBar setSideBarOption={setSideBarOption} />
        {sideBarOption === "message" && <ChatList />}
        {sideBarOption === "friend" && (
          <ListFriend setshowPopUp={setshowPopUp} />
        )}
        {sideBarOption === "friendRequest" && <FriendRequest />}
        <ChatBox openProfile={openProfile} setOpenProfile={setOpenProfile} />
        {openProfile && <Profile />}
      </div>
      {showPopUp && <AddFriendPopUp setshowPopUp={setshowPopUp} />}
    </>
  );
}
