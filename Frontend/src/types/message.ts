type MessageSender = {
  _id: string;
  name: string;
  avatar: string;
} | string;

export type Message = {
  _id?: number;
  chatId: string
  text: string;
  sender: MessageSender
  createdAt: string;
  images?: string[]
};

export function isSenderObject(sender: MessageSender): sender is { _id: string; name: string; avatar: string } {
  return typeof sender !== "string";
}
