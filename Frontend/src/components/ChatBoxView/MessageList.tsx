import { MessageReceive } from "@/types/message";
import React, { useCallback, useEffect, useState } from "react";
import MessageBubble from "../MessageBubble";
import { getMessage } from "@/services/chatService";
import { Socket } from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function MessageList({
  messagesEndRef,
  socket,
  scrollToBottom,
  chatId,
}: {
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  socket: Socket | null;
  scrollToBottom: () => void;
  chatId: string;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<MessageReceive[]>([]);
  const LIMIT = 20;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const loadInitialMessages = async () => {
      setInitialLoad(true);
      setMessages([]);
      setPage(1);
      const res = await getMessage(chatId, 1, LIMIT);
      if (res) {
        setMessages(res.messages.reverse());
        setHasMore(res.hasMore);
        setInitialLoad(false);
        return;
      }
      setHasMore(false);
    };
    loadInitialMessages();
  }, [chatId]);

  useEffect(() => {
    if (!initialLoad) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [initialLoad, scrollToBottom]);

  useEffect(() => {
    if (!socket) return;
    const handleReceiveMessage = (data: MessageReceive) => {
      console.log("Received message:", data);
      if (data.chatId !== chatId) return;
      setMessages((prev) => [...prev, data]);
    };
    socket.on("message_received", handleReceiveMessage);

    return () => {
      socket.off("message_received", handleReceiveMessage);
    };
  }, [socket, chatId]);

  const loadMoreMessages = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const newPage = page + 1;
    const res = await getMessage(chatId, newPage, LIMIT);
    if (!res || res.messages.length === 0) {
      setHasMore(false);
      setLoading(false);
      return;
    }
    const container = containerRef.current;
    const previousScrollHeight = container ? container.scrollHeight : 0;
    const previousScrollTop = container?.scrollTop || 0;
    console.log(previousScrollHeight, previousScrollTop);
    const newMessages = res.messages.reverse();
    setMessages((prev) => [...newMessages, ...prev]);
    setHasMore(res.hasMore);
    setPage(newPage);
    requestAnimationFrame(() => {
      if (container) {
        const newScrollHeight = container.scrollHeight;
        const heightDiff = newScrollHeight - previousScrollHeight;
        container.scrollTop = previousScrollTop + heightDiff;
        console.log(newScrollHeight, container.scrollTop);
      }
    });
    setLoading(false);
  }, [chatId, page, hasMore, loading]);

  useEffect(() => {
    if (initialLoad) return;
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container || loading || !hasMore) return;
      if (container.scrollTop < 50) {
        loadMoreMessages();
      }
    };
    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore, loadMoreMessages, loading,initialLoad]);
  return (
    <div
      className="p-3 flex-1 min-w-0 min-h-0 overflow-y-auto custom-scrollbar"
      ref={containerRef}
    >
      {loading && !initialLoad && (
        <FontAwesomeIcon
          icon={faSpinner}
          className="animate-spin text-white/50 size-5 text-center"
        />
      )}

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
  );
}
