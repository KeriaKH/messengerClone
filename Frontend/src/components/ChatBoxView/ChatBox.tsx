"use client";

import { sendMessage } from "@/services/chatService";
import { uploadImages } from "@/services/cloudinaryService";
import { chat } from "@/types/chat";
import { MessageSend } from "@/types/message";
import {
  formatTimeAgo,
  formatTimeAgoWithChat,
  getChatName,
} from "@/utils/fomart";
import {
  faEllipsis,
  faPhone,
  faVideo,
  faX
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ChatImage from "../ChatImage";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

export default function ChatBox({
  setOpenProfile,
  openProfile,
  chat,
}: {
  setOpenProfile: (item: boolean) => void;
  openProfile: boolean;
  chat: chat;
}) {

  const [text, setText] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSeen, setLastSeen] = useState(
    formatTimeAgoWithChat(chat, user?.id || "")
  );

  const ChatOnline = useMemo(() => {
    return chat.isGroup
      ? chat.members.some(
          (member) =>
            member.id._id !== user?.id && onlineUsers.includes(member.id._id)
        )
      : onlineUsers.includes(
          chat.members.find((m) => m.id._id !== user?.id)?.id._id || ""
        );
  }, [chat, onlineUsers, user]);

  const [wasOnline, setWasOnline] = useState(ChatOnline);
  useEffect(() => {
    if (wasOnline && !ChatOnline) {
      setLastSeen(formatTimeAgo(new Date().toISOString()));
    }
    setWasOnline(ChatOnline);
  }, [onlineUsers, wasOnline, ChatOnline]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  };


  const handleSend = async () => {
    if (!socket) return;
    if (!user?.id) return;
    let images: string[] = [];
    const trimmedText = text.trim();
    if (trimmedText === "" && selectedFiles.length === 0) return;
    if (selectedFiles.length > 0) {
      setIsLoading(true);
      const raw = await uploadImages(selectedFiles);
      if (!raw) return;
      images = raw;
      setSelectedFiles([]);
      setPreviewImages([]);
    }
    const newMsg: MessageSend = {
      chatId: chat._id,
      text: trimmedText,
      sender: user.id,
      images,
    };
    const receiver = chat.members.map((m) => m.id._id);

    const res = await sendMessage(newMsg);
    setIsLoading(false);
    if (!res) return;
    socket.emit("send_message", {
      messageData: res,
      receiver: receiver,
    });
    scrollToBottom();
    setText("");
  };

  const handleSendEmoji = async () => {
    if (!socket) return;
    if (!user?.id) return;
    const newMsg: MessageSend = {
      chatId: chat._id,
      text: "👍",
      sender: user.id,
    };
    const receiver = chat.members.map((m) => m.id._id);
    const res = await sendMessage(newMsg);
    if (!res) return;
    socket.emit("send_message", {
      messageData: res,
      receiver: receiver,
    });
    scrollToBottom();
  };

  
  return (
    <div className="flex-1 h-full bg-[rgba(31,31,31,255)] rounded-2xl flex flex-col">
      <div className="w-full p-2 px-5 flex items-center space-x-2 shadow">
        <ChatImage chat={chat} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold">{getChatName(chat, user?.id || "")}</p>
          <p className="text-sm text-white/30 truncate">
            {ChatOnline ? "Đang hoạt động" : "hoạt động " + lastSeen}
          </p>
        </div>
        <div>
          <FontAwesomeIcon
            icon={faPhone}
            className=" p-3 rounded-full hover:bg-white/10 "
          />
          <FontAwesomeIcon
            icon={faVideo}
            className=" p-3 rounded-full hover:bg-white/10 "
          />
          <FontAwesomeIcon
            icon={openProfile ? faX : faEllipsis}
            className=" p-3 rounded-full hover:bg-white/10 "
            onClick={() => setOpenProfile(!openProfile)}
          />
        </div>
      </div>
      <MessageList socket={socket} chatId={chat._id} messagesEndRef={messagesEndRef} scrollToBottom={scrollToBottom} />
      <MessageInput
        selectedFiles={selectedFiles}
        previewImages={previewImages}
        setSelectedFiles={setSelectedFiles}
        setPreviewImages={setPreviewImages} 
        handleSend={handleSend}
        handleSendEmoji={handleSendEmoji}
        text={text}
        setText={setText}
        setShowPicker={setShowPicker}
        showPicker={showPicker}
        isLoading={isLoading}
      />
      {showPicker && (
        <div className="mt-2 w-full">
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              setText((prev) => prev + emojiData.emoji);
              console.log(emojiData.emoji);
            }}
            style={{ width: "100%" }}
          />
        </div>
      )}
    </div>
  );
}
