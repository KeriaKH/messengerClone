import { chat } from "@/types/chat";
import { MessageReceive } from "@/types/message";
import { formatTimeAgo, getChatName } from "@/utils/fomart";
import { useEffect, useState } from "react";
import ChatImage from "./ChatImage";
import { useAuth } from "./context/AuthContext";
import { useSocket } from "./context/SocketContext";

export default function ChatCard({
  item,
  setSelectedChat,
}: {
  item: chat;
  setSelectedChat: (chat: chat) => void;
}) {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [lastMessage, setLastMessage] = useState<MessageReceive | null>(
    item.lastMessage || null
  );
  useEffect(() => {
    if (!socket) return;
    const handleLastMessage = (data: MessageReceive) => {
      if (item._id === data.chatId) setLastMessage(data);
    };
    socket.on("message_received", handleLastMessage);
    return () => {
      socket.off("message_received", handleLastMessage);
    };
  }, [socket, item]);
  return (
    <div
      className="w-full p-3 flex items-center space-x-2 hover:bg-white/10 rounded-xl transition"
      onClick={() => setSelectedChat(item)}
    >
      <ChatImage chat={item} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{getChatName(item, user?.id || "")}</p>
        <p className="text-sm text-white/30 truncate">
          {lastMessage?.text || ""}
        </p>
      </div>
      <p className="text-sm text-white/30 text-end">
        {lastMessage ? formatTimeAgo(lastMessage.createdAt) : ""}
      </p>
    </div>
  );
}
