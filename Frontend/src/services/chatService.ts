import { AxiosError } from "axios"
import api from "./api"
import { MessageSend } from "@/types/message"

export const getMessage = async (id: string) => {
    try {
        const res = await api.get(`api/chat/${id}`)
        if (res.data)
            return res.data
        return null
    } catch (err) {
        const error = err as AxiosError<{ error: string }>
        console.log(error);
        return null
    }
}

export const createChat = async (data: { members: { id: string, nickName: string }[]; isGroup: boolean }) => {
    try {
        const res = await api.post("api/chat", data)
        if (res.data)
            return res.data
        return null
    } catch (err) {
        const error = err as AxiosError<{ error: string }>
        console.log(error);
        return null
    }
}

export const sendMessage = async (data: MessageSend) => {
    try {
        const res = await api.post("api/chat/message/send", data)
        if (res.data)
            return res.data
        return null
    } catch (err) {
        const error = err as AxiosError<{ error: string }>
        console.log(error);
        return null
    }
}