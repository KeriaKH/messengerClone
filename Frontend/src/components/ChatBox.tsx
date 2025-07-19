"use client";

import { getMessage } from "@/services/chatService";
import { chat } from "@/types/chat";
import { Message } from "@/types/message";
import {
  formatTimeAgoWithChat,
  getChatName,
  getChatOnline,
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
import { useEffect, useRef, useState } from "react";
import ChatImage from "./ChatImage";
import MessageBubble from "./MessageBubble";
import { useAuth } from "./context/AuthContext";

export default function ChatBox({
  setOpenProfile,
  openProfile,
  chat,
}: {
  setOpenProfile: (item: boolean) => void;
  openProfile: boolean;
  chat: chat;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    getMessage(chat._id).then((res) => {
      console.log(res.reverse());
      setMessages(res);
    });
  }, [chat._id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    const trimmedText = text.trim();
    if (!trimmedText) return;
    if (!user?.id) return;
    const newMsg: Message = {
      chatId: chat._id,
      text: trimmedText,
      sender: user.id,
      createdAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setText("");
  };

  const handleSendEmoji = () => {
    if (!user?.id) return;
    const newMsg: Message = {
      chatId: chat._id,
      text: "👍",
      sender: user.id,
      createdAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMsg]);
  };
  return (
    <div className="flex-1 h-full bg-[rgba(31,31,31,255)] rounded-2xl flex flex-col">
      <div className="w-full p-2 px-5 flex items-center space-x-2 shadow">
        <ChatImage chat={chat}/>
        <div className="flex-1 min-w-0">
          <p className="font-semibold">{getChatName(chat, user?.id || "")}</p>
          <p className="text-sm text-white/30 truncate">
            {getChatOnline(chat, user?.id || "")
              ? "Đang hoạt động"
              : "hoạt động " + formatTimeAgoWithChat(chat, user?.id || "")}
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
        {messages.map((item: Message, index) => {
          const isLastFromSender =
            index === messages.length - 1 ||
            (messages[index + 1].sender as { _id: string })._id !== (item.sender as { _id: string })._id;
            const isFirstFromSender =
            index === 0 ||
            (messages[index - 1].sender as { _id: string })._id !== (item.sender as { _id: string })._id;
          return <MessageBubble item={item} key={index} isLast={isLastFromSender} isFirst={isFirstFromSender}/>;
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
