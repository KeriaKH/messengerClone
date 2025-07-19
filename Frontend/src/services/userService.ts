import { AxiosError } from "axios"
import api from "./api"
import { friend } from "@/types/friend"
import { chat } from "@/types/chat"
import { friendSuggest } from "@/types/friendRequest"

export const getFriend = async (id: string|undefined):Promise<friend[]|null> => {
    try {
        const res = await api.get(`api/user/${id}/friend`)
        if (res.data) return res.data
        return null
    } catch (err) {
        const error = err as AxiosError<{ error: string }>
        console.log(error);
        return null
    }
}

export const getFriendSuggest = async (id: string|undefined):Promise<friendSuggest[]|null> => {
    try {
        const res = await api.get(`api/user/${id}/friendSuggest`)
        if (res.data) return res.data
        return null
    } catch (err) {
        const error = err as AxiosError<{ error: string }>
        console.log(error);
        return null
    }
}

export const getChat = async (id: string|undefined):Promise<chat[]|null> => {
    try {
        const res = await api.get(`api/user/${id}/chat`)
        if (res.data) return res.data
        return null
    } catch (err) {
        const error = err as AxiosError<{ error: string }>
        console.log(error);
        return null
    }
}

export const getUserData = async (id: string|undefined):Promise<friend|null> => {
    try {
        const res = await api.get(`api/user/${id}`)
        if (res.data) return res.data
        return null
    } catch (err) {
        const error = err as AxiosError<{ error: string }>
        console.log(error);
        return null
    }
}
