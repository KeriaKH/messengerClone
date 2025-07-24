"use client";

import AddFriendPopUp from "@/components/AddFriendPopUp";
import CallPopUp from "@/components/CallPopUp";
import ChatBox from "@/components/ChatBoxView/ChatBox";
import ChatList from "@/components/ChatList";
import { useAuth } from "@/components/context/AuthContext";
import { useSocket } from "@/components/context/SocketContext";
import CreateNewChat from "@/components/CreateNewChat";
import FriendRequest from "@/components/FriendRequest";
import ListFriend from "@/components/ListFriend";
import Profile from "@/components/Profile";
import SideBar from "@/components/SideBar";
import { useWindowSize } from "@/components/UseWindowSize";
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
  const [callReceive, setCallReceive] = useState(false);
  const [whoCalled, setWhoCalled] = useState<string | null>(null);
  const [callType, setCallType] = useState<string | null>(null);
  const [selectedChat, setSelectedChat] = useState<chat | null>(null);
  const [chats, setChats] = useState<chat[] | null>(null);
  const { isAuth, user } = useAuth();
  const { socket } = useSocket();
  const { width } = useWindowSize();
  const router = useRouter();

  const isSmallScreen = width < 1024;

  const shouldHideChatBox = isSmallScreen && openProfile;

  useEffect(() => {
    if (!user?.id) return;
    getChat(user.id).then((res) => {
      console.log("chats", res);
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

  useEffect(() => {
    if (!socket) return;
    const handleReceiveCall = (data: { from: string,type:string }) => {
      setCallReceive(true);
      setWhoCalled(data.from);
      setCallType(data.type);
    };
    socket.on("incoming_call", handleReceiveCall);
    return () => {
      socket.off("incoming_call", handleReceiveCall);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    const handleStopCall = () => {
      setCallReceive(false);
      setWhoCalled(null);
    };
    socket.on("call_ended_before_accept", handleStopCall);
    return () => {
      socket.off("call_ended_before_accept", handleStopCall);
    };
  }, [socket]);

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
            chats={chats}
            setSelectedChat={setSelectedChat}
            setshowPopUp={setshowCreateChatPopUp}
          />
        )}
        {sideBarOption === "friend" && (
          <ListFriend setshowPopUp={setshowAddFriendPopUp} />
        )}
        {sideBarOption === "friendRequest" && <FriendRequest />}
        {selectedChat && !shouldHideChatBox && (
          <ChatBox
            openProfile={openProfile}
            setOpenProfile={setOpenProfile}
            chat={selectedChat}
          />
        )}
        {openProfile && selectedChat && <Profile chat={selectedChat} setOpenProfile={setOpenProfile} />}
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
      {callReceive && (
        <CallPopUp setCallReceive={setCallReceive} whoCalled={whoCalled} callType={callType} />
      )}
    </>
  );
}
