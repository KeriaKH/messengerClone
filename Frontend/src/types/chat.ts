import { friend } from "./friend"
import { Message } from "./message"

export interface chat{
    _id:string
    name:string
    isGroup:boolean
    members:[
        {
            id:friend
            nickName:string
        }
    ]
    lastMessage: Message
}