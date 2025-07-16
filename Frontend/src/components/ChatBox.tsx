"use client";

import { Message } from "@/types/message";
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
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatBox({
  setOpenProfile,
  openProfile,
}: {
  setOpenProfile: (item: boolean) => void;
  openProfile: boolean;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/messages.json")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setMessages(data);
      });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    const trimmedText = text.trim();
    if (!trimmedText) return;
    const newMsg: Message = {
      text: trimmedText,
      sender: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setText("");
  };

  const handleSendEmoji = () => {
    const newMsg: Message = {
      text: "👍",
      sender: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMsg]);
  };
  return (
    <div className="flex-1 h-full bg-[rgba(31,31,31,255)] rounded-2xl flex flex-col">
      <div className="w-full p-2 px-5 flex items-center space-x-2 shadow">
        <Image
          src="/avatar.jpg"
          alt="avatar"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold">Thế Vinh</p>
          <p className="text-sm text-white/30 truncate">Đang hoạt động</p>
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
            icon={openProfile?faX:faEllipsis}
            className=" p-3 rounded-full hover:bg-white/10 "
            onClick={() => setOpenProfile(!openProfile)}
          />
        </div>
      </div>
      <div className="p-3 flex-1 min-w-0 min-h-0 overflow-y-auto custom-scrollbar space-y-1">
        {messages.map((item: Message, index) => (
          <MessageBubble item={item} key={index} />
        ))}
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
