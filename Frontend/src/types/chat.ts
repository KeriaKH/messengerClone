import { friend } from "./friend"
import { MessageReceive } from "./message"

export interface chat {
    _id: string
    name: string
    image: string
    isGroup: boolean
    members:
    {
        id: friend
        nickName: string
    }[]
    lastMessage: MessageReceive
}