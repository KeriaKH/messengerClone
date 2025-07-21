export type MessageSend = {
  chatId: string
  text: string;
  sender: string
  images?: string[]
}

export type MessageReceive = {
  _id?: number;
  chatId: string
  text: string;
  sender: {
    _id: string;
    name: string;
    avatar: string;
  }
  createdAt: string;
  images?: string[]
};

