"use client";

import { getMessage, sendMessage } from "@/services/chatService";
import { chat } from "@/types/chat";
import { MessageReceive, MessageSend } from "@/types/message";
import {
  formatTimeAgo,
  formatTimeAgoWithChat,
  getChatName,
} from "@/utils/fomart";
import {
  faEllipsis,
  faFaceSmile,
  faImage,
  faPaperPlane,
  faPhone,
  faThumbsUp,
  faVideo,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ChatImage from "./ChatImage";
import MessageBubble from "./MessageBubble";
import { useAuth } from "./context/AuthContext";
import { useSocket } from "./context/SocketContext";
import { getSocket } from "@/socket/socket";

export default function ChatBox({
  setOpenProfile,
  openProfile,
  chat,
}: {
  setOpenProfile: (item: boolean) => void;
  openProfile: boolean;
  chat: chat;
}) {
  const [messages, setMessages] = useState<MessageReceive[]>([]);
  const [text, setText] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { onlineUsers } = useSocket();
  const socket = getSocket();

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

  const [lastSeen, setLastSeen] = useState(
    formatTimeAgoWithChat(chat, user?.id || "")
  );
  const [wasOnline, setWasOnline] = useState(ChatOnline);

  useEffect(() => {
    if (wasOnline && !ChatOnline) {
      setLastSeen(formatTimeAgo(new Date().toISOString()));
    }
    setWasOnline(ChatOnline);
  }, [onlineUsers, wasOnline, ChatOnline]);

  useEffect(() => {
    getMessage(chat._id).then((res) => {
      console.log(res.reverse());
      setMessages(res);
    });
  }, [chat._id]);

  useEffect(() => {
    const handleReceiveMessage = (data: MessageReceive) => {
      console.log("Received message:", data);
      setMessages((prev) => [...prev, data]);
    };
    socket.on("message_received", handleReceiveMessage);

    return () => {
      socket.off("message_received", handleReceiveMessage);
    };
  }, [socket]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    const trimmedText = text.trim();
    if (!trimmedText) return;
    if (!user?.id) return;
    const newMsg: MessageSend = {
      chatId: chat._id,
      text: trimmedText,
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
    setText("");
  };

  const handleSendEmoji = async () => {
    if (!user?.id) return;
    const newMsg: MessageSend = {
      chatId: chat._id,
      text: "👍",
      sender: user.id,
    };
    const res = await sendMessage(newMsg);
    if (!res) return;
    setMessages((prev) => [...prev, res]);
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
      <div className="p-3 flex-1 min-w-0 min-h-0 overflow-y-auto custom-scrollbar">
        {messages.map((item: MessageReceive, index) => {
          const isLastFromSender =
            index === messages.length - 1 ||
            messages[index + 1].sender._id !== item.sender._id;
          const isFirstFromSender =
            index === 0 || messages[index - 1].sender._id !== item.sender._id;
          return (
            <MessageBubble
              item={item}
              key={index}
              isLast={isLastFromSender}
              isFirst={isFirstFromSender}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="w-full flex items-center px-3 py-2 space-x-3 shadow">
        <FontAwesomeIcon
          icon={faImage}
          className=" p-3 rounded-full hover:bg-white/10 size-5"
        />
        <div className=" bg-white/10 flex-1 rounded-2xl flex items-center">
          <input
            type="text"
            value={text || ""}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            className="p-2 px-4 focus:outline-none flex-1"
            placeholder="Aa"
          />

          <FontAwesomeIcon
            icon={faFaceSmile}
            onClick={() => setShowPicker(!showPicker)}
            className=" p-3 rounded-full hover:bg-white/10 size-5"
          />
        </div>
        {text.trim() === "" ? (
          <FontAwesomeIcon
            icon={faThumbsUp}
            onClick={handleSendEmoji}
            className=" p-3 rounded-full hover:bg-white/10 size-5"
          />
        ) : (
          <FontAwesomeIcon
            icon={faPaperPlane}
            onClick={handleSend}
            className=" p-3 rounded-full hover:bg-white/10 size-5"
          />
        )}
      </div>
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
