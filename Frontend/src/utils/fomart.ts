import { chat } from "@/types/chat";

export function formatTimeAgo(createdAt: string | Date): string {
    const now = new Date();
    const time = new Date(createdAt);
    const diffMs = now.getTime() - time.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (seconds < 60) return "vừa xong";
    if (minutes < 60) return `${minutes} phút`;
    if (hours < 24) return `${hours} giờ`;
    if (days === 1) return "hôm qua";
    if (days < 7) return `${days} ngày`;

    // Nếu lâu hơn 7 ngày thì trả về định dạng ngày cụ thể
    return time.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export function formatTimeAgoWithChat(chat: chat, userId: string): string {
    const now = new Date();
    const user = chat.members.find(member => member.id._id !== userId)
    if (!user)
        return ""
    const time = new Date(user.id.lastSeen);
    const diffMs = now.getTime() - time.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (seconds < 60) return "vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days === 1) return "hôm qua";
    if (days < 7) return `${days} ngày trước`;

    // Nếu lâu hơn 7 ngày thì trả về định dạng ngày cụ thể
    return time.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export function getChatName(chat: chat, userId: string): string {
    if (chat.isGroup) {
        if (chat.name && chat.name.trim() !== "")
            return chat.name

        const groupName = chat.members.map((member) => member.id.name).join(", ")
        return groupName
    }
    const user = chat.members.find(member => member.id._id !== userId)
    if (!user)
        return ""
    if (user.nickName.trim() !== "")
        return user.nickName
    return user.id.name
}

export function getChatOnline(chat: chat, userId: string): boolean {
    if (chat.isGroup) {
        const groupOnline = chat.members.some((member) => member.id._id === userId ? false : member.id.isOnline)
        return groupOnline
    }
    const user = chat.members.find(member => member.id._id !== userId)
    if (user)
        return user.id.isOnline
    return false
}


