"use client";

import AddFriendPopUp from "@/components/AddFriendPopUp";
import ChatBox from "@/components/ChatBox";
import ChatList from "@/components/ChatList";
import { useAuth } from "@/components/context/AuthContext";
import CreateNewChat from "@/components/CreateNewChat";
import FriendRequest from "@/components/FriendRequest";
import ListFriend from "@/components/ListFriend";
import Profile from "@/components/Profile";
import SideBar from "@/components/SideBar";
import { createChat } from "@/services/chatService";
import { getChat } from "@/services/userService";
import { chat } from "@/types/chat";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [openProfile, setOpenProfile] = useState(false);
  const [sideBarOption, setSideBarOption] = useState("message");
  const [showAddFriendPopUp, setshowAddFriendPopUp] = useState(false);
  const [showCreateChatPopUp, setshowCreateChatPopUp] = useState(false);
  const [selectedChat, setSelectedChat] = useState<chat | null>(null);
  const [chats, setChats] = useState<chat[] | null>(null); // Lift up state
  const { isAuth, user } = useAuth();
  const router = useRouter();

  // Load chats ở HomePage
  useEffect(() => {
    if (!user?.id) return;
    getChat(user.id).then((res) => {
      setChats(res);
    });
  }, [user?.id]);

  useEffect(() => {
    if (!isAuth) router.push("/");
  }, [isAuth, router]);

  useEffect(() => {
    const raw = sessionStorage.getItem("selectedChat");
    if (raw) setSelectedChat(JSON.parse(raw));
  }, []);

  useEffect(() => {
    if (selectedChat)
      sessionStorage.setItem("selectedChat", JSON.stringify(selectedChat));
  }, [selectedChat]);

  const handleAccept = async (selectedFriend: string[]) => {
    if (!selectedFriend || selectedFriend.length < 2) {
      return alert("Vui lòng chọn bạn bè để tạo chat");
    }
    const data = {
      members:
        selectedFriend?.map((item) => ({ id: item, nickName: "" })) || [],
      isGroup: selectedFriend && selectedFriend?.length > 2,
    };
    console.log("data", data);
    await createChat(data).then((res) => {
      setSelectedChat(res);
      setChats((prev) => (prev ? [...prev, res] : [res]));
    });

    setshowCreateChatPopUp(false);
  };

  return (
    <>
      <div className="flex h-screen w-full p-5 space-x-5">
        <SideBar setSideBarOption={setSideBarOption} />
        {sideBarOption === "message" && (
          <ChatList
            chats={chats} // Truyền chats xuống
            setSelectedChat={setSelectedChat}
            setshowPopUp={setshowCreateChatPopUp}
          />
        )}
        {sideBarOption === "friend" && (
          <ListFriend setshowPopUp={setshowAddFriendPopUp} />
        )}
        {sideBarOption === "friendRequest" && <FriendRequest />}
        {selectedChat && (
          <ChatBox
            openProfile={openProfile}
            setOpenProfile={setOpenProfile}
            chat={selectedChat}
          />
        )}
        {openProfile && selectedChat && <Profile chat={selectedChat} />}
      </div>
      {showAddFriendPopUp && (
        <AddFriendPopUp setshowPopUp={setshowAddFriendPopUp} />
      )}
      {showCreateChatPopUp && (
        <CreateNewChat
          setshowPopUp={setshowCreateChatPopUp}
          handleAccept={handleAccept}
        />
      )}
    </>
  );
}
