import { chat } from "@/types/chat";
import { formatTimeAgo, getChatName } from "@/utils/fomart";
import ChatImage from "./ChatImage";
import { useAuth } from "./context/AuthContext";

export default function ChatCard({
  item,
  setSelectedChat,
}: {
  item: chat;
  setSelectedChat: (chat: chat) => void;
}) {
  const { user } = useAuth();
  return (
    <div
      className="w-full p-3 flex items-center space-x-2 hover:bg-white/10 rounded-xl transition"
      onClick={() => setSelectedChat(item)}
    >
      <ChatImage chat={item}/>
      <div className="flex-1 min-w-0">
        <p className="font-semibold">{getChatName(item, user?.id || "")}</p>
        <p className="text-sm text-white/30 truncate">
          {item.lastMessage.text}
        </p>
      </div>
      <p className="text-sm text-white/30 text-end">
        {formatTimeAgo(item.lastMessage.createdAt)}
      </p>
    </div>
  );
}
